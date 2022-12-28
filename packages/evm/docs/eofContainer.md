``` mermaid

classDiagram
    EOF_Container --|> EOF_Header
    EOF_Container --|> EOF_Body
    EOF_Container : EOF_Header
    EOF_Container : EOF_Body
    EOF_Container: fromBytes()
    EOF_Container: buffer()
    class EOF_Header{
        typeSize
        numCodeSections
        codeSize+
        dataSize
   fromBytes()
   buffer()
    }
    EOF_Header -- MAGIC
    MAGIC: 0xEF00
    EOF_Header -- VERSION
    VERSION: 0x01
    EOF_Header -- KIND_TYPE
    KIND_TYPE: 0X01
    EOF_Header -- TYPE_SIZE
    TYPE_SIZE: typesection.length
    EOF_Header -- KIND_CODE
    KIND_CODE: 0X02
    EOF_Header -- CODE_SIZE
    more_code_sizes ..> CODE_SIZE
    more_code_sizes: section.length,
    more_code_sizes: section.length,...
    CODE_SIZE: codesection.length
    EOF_Header -- KIND_DATA
    KIND_DATA: 0X03
    EOF_Header -- DATA_SIZE
    DATA_SIZE: datasection.length 
    EOF_Header -- TERMINATOR
    TERMINATOR: 0X00

    KIND_TYPE ..> Type_Section
    KIND_CODE ..> Code_Section
    KIND_DATA ..> Data_Section
    TYPE_SIZE ..> Type_Section
    CODE_SIZE ..> Code_Section
    DATA_SIZE ..> Data_Section
    Type_Section -- SectionHeader
    Code_Section -- SectionHeader
    Data_Section -- SectionHeader
    class SectionHeader{
        sectionKind
        sectionSize+
    }
    class EOF_Body{
        typeSection+
        codeSection+
        dataSection
    }
    EOF_Body -- TypeSection
    EOF_Body -- CodeSection
    EOF_Body .. More_CodeSections
    EOF_Body .. More_CodeSections
    EOF_Body .. More_CodeSections
    EOF_Body .. More_CodeSections
    EOF_Body .. More_CodeSections
    EOF_Body .. DataSection

    class TypeSection{
     inputs
     outputs
     maxStackHeight   
    }
    TypeSection --> code_section
    class code_section{
     inputs
     outputs
     maxStackHeight   
    }
    class more_code_sections{
     inputs
     outputs
     maxStackHeight   
    }
    TypeSection ..> more_code_sections
    TypeSection ..> more_code_sections
    TypeSection ..> more_code_sections
    TypeSection ..> more_code_sections
    TypeSection ..> more_code_sections
    TypeSection ..> data_Section
    class data_Section{
     inputs
     outputs
     maxStackHeight   
    }
```