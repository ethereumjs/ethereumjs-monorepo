
.PHONY: clean distclean deps ganache erc20

# Settings
# --------

ANALYSIS_BACKEND=ocaml
MAIN_MODULE:=KEVM-ANALYSIS
MAIN_DEFN_FILE:=kevm-analysis

BUILD_DIR:=.build
DEPS_DIR:=deps
DEFN_DIR:=$(BUILD_DIR)/defn
KEVM_SUBMODULE:=$(DEPS_DIR)/evm-semantics
KEVM_DEPS:=$(KEVM_SUBMODULE)/deps
K_RELEASE:=$(KEVM_SUBMODULE)/deps/k/k-distribution/target/release/k
K_BIN:=$(K_RELEASE)/bin
K_LIB:=$(K_RELEASE)/lib
KEVM_DIR:=.
KEVM_MAKE:=make --directory $(KEVM_SUBMODULE) BUILD_DIR=$(BUILD_DIR)

export K_RELEASE
export KEVM_DIR

PANDOC_TANGLE_SUBMODULE:=$(KEVM_SUBMODULE)/deps/pandoc-tangle
TANGLER:=$(PANDOC_TANGLE_SUBMODULE)/tangle.lua
LUA_PATH:=$(PANDOC_TANGLE_SUBMODULE)/?.lua;;
export TANGLER
export LUA_PATH

GANACHE_CORE_SUBMODULE:=$(DEPS_DIR)/ganache-core
GANACHE_CLI_SUBMODULE :=$(DEPS_DIR)/ganache-cli

clean:
	rm -rf $(DEFN_DIR)

distclean: clean
	rm -rf $(BUILD_DIR)

ganache:
	git submodule update --init --recursive -- $(GANACHE_CORE_SUBMODULE) $(GANACHE_CLI_SUBMODULE)
	npm install
	protoc --js_out=import_style=commonjs,binary:. lib/proto/msg.proto
	npm run build:dist
	npm link
	cd $(GANACHE_CORE_SUBMODULE)  \
	    && npm install            \
	    && npm link ethereumjs-vm \
	    && npm run build          \
	    && npm link
	cd $(GANACHE_CLI_SUBMODULE)  \
	    && npm install           \
	    && npm link ganache-core \
	    && npm run build

erc20:
	cd deps/openzeppelin-solidity \
	    && npm install

deps:
	git submodule update --init --recursive
	$(KEVM_MAKE) llvm-deps

# Regular Semantics Build
# -----------------------

build-kevm-%:
	$(KEVM_MAKE) build-$*
