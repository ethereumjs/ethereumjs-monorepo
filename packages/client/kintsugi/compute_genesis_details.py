import os
from eth2spec.phase0.mainnet import *

with open('genesis.ssz', 'rb') as f:
    genesis_state = BeaconState.deserialize(f, os.stat('genesis.ssz').st_size)

updated_header = genesis_state.latest_block_header.copy()
updated_header.state_root = genesis_state.hash_tree_root()

assert genesis_state.latest_block_header.state_root == Bytes32()

print(f"""
genesis_time: {genesis_state.genesis_time}
genesis_state_root: 0x{genesis_state.hash_tree_root().hex()}
genesis_latest_block_header:
  slot: {genesis_state.latest_block_header.slot}
  proposer_index: {genesis_state.latest_block_header.proposer_index}
  parent_root: 0x{genesis_state.latest_block_header.parent_root.hex()}
  state_root: 0x{genesis_state.latest_block_header.state_root.hex()}
  body_root: 0x{genesis_state.latest_block_header.body_root.hex()}
genesis_block_root_no_state_root: 0x{genesis_state.latest_block_header.hash_tree_root().hex()}
genesis_block_root_updated_state_root: 0x{updated_header.hash_tree_root().hex()}
genesis_validators_root: 0x{genesis_state.validators.hash_tree_root().hex()}
genesis_validators_count: {genesis_state.validators.length()}
genesis_active_validators_count: {len(get_active_validator_indices(genesis_state, Epoch(0)))}
genesis_total_active_stake_gwei: {get_total_active_balance(genesis_state)}
genesis_total_balance_gwei: {sum(genesis_state.balances.readonly_iter())}
eth1_data:
  deposit_root: 0x{genesis_state.eth1_data.deposit_root.hex()}
  deposit_count: {genesis_state.eth1_data.deposit_count}
  block_hash: 0x{genesis_state.eth1_data.block_hash.hex()}
deposit index: {genesis_state.eth1_deposit_index}
genesis_fork_version: 0x{genesis_state.fork.current_version.hex()}
genesis_fork_digest: 0x{compute_fork_digest(genesis_state.fork.current_version, genesis_state.validators.hash_tree_root()).hex()}
pre_genesis_fork_digest: 0x{compute_fork_digest(genesis_state.fork.current_version, Root()).hex()}
""")


