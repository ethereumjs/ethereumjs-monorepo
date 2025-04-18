import { concatBytes, hexToBytes } from '@ethereumjs/util'

// base field modulus as described in the EIP
export const BLS_FIELD_MODULUS = BigInt(
  '0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaab',
)

export const BLS_G1_POINT_BYTE_LENGTH = 128
export const BLS_G2_POINT_BYTE_LENGTH = 256

export const BLS_G1_INFINITY_POINT_BYTES = new Uint8Array(BLS_G1_POINT_BYTE_LENGTH)
export const BLS_G2_INFINITY_POINT_BYTES = new Uint8Array(BLS_G2_POINT_BYTE_LENGTH)

export const BLS_ZERO_BUFFER = new Uint8Array(32)
export const BLS_ONE_BUFFER = concatBytes(new Uint8Array(31), hexToBytes('0x01'))

// G1/G2 MSM discount constants taken from EIP-2537
export const BLS_GAS_DISCOUNT_PAIRS_G1: [number, number][] = [
  [1, 1000],
  [2, 949],
  [3, 848],
  [4, 797],
  [5, 764],
  [6, 750],
  [7, 738],
  [8, 728],
  [9, 719],
  [10, 712],
  [11, 705],
  [12, 698],
  [13, 692],
  [14, 687],
  [15, 682],
  [16, 677],
  [17, 673],
  [18, 669],
  [19, 665],
  [20, 661],
  [21, 658],
  [22, 654],
  [23, 651],
  [24, 648],
  [25, 645],
  [26, 642],
  [27, 640],
  [28, 637],
  [29, 635],
  [30, 632],
  [31, 630],
  [32, 627],
  [33, 625],
  [34, 623],
  [35, 621],
  [36, 619],
  [37, 617],
  [38, 615],
  [39, 613],
  [40, 611],
  [41, 609],
  [42, 608],
  [43, 606],
  [44, 604],
  [45, 603],
  [46, 601],
  [47, 599],
  [48, 598],
  [49, 596],
  [50, 595],
  [51, 593],
  [52, 592],
  [53, 591],
  [54, 589],
  [55, 588],
  [56, 586],
  [57, 585],
  [58, 584],
  [59, 582],
  [60, 581],
  [61, 580],
  [62, 579],
  [63, 577],
  [64, 576],
  [65, 575],
  [66, 574],
  [67, 573],
  [68, 572],
  [69, 570],
  [70, 569],
  [71, 568],
  [72, 567],
  [73, 566],
  [74, 565],
  [75, 564],
  [76, 563],
  [77, 562],
  [78, 561],
  [79, 560],
  [80, 559],
  [81, 558],
  [82, 557],
  [83, 556],
  [84, 555],
  [85, 554],
  [86, 553],
  [87, 552],
  [88, 551],
  [89, 550],
  [90, 549],
  [91, 548],
  [92, 547],
  [93, 547],
  [94, 546],
  [95, 545],
  [96, 544],
  [97, 543],
  [98, 542],
  [99, 541],
  [100, 540],
  [101, 540],
  [102, 539],
  [103, 538],
  [104, 537],
  [105, 536],
  [106, 536],
  [107, 535],
  [108, 534],
  [109, 533],
  [110, 532],
  [111, 532],
  [112, 531],
  [113, 530],
  [114, 529],
  [115, 528],
  [116, 528],
  [117, 527],
  [118, 526],
  [119, 525],
  [120, 525],
  [121, 524],
  [122, 523],
  [123, 522],
  [124, 522],
  [125, 521],
  [126, 520],
  [127, 520],
  [128, 519],
]

export const BLS_GAS_DISCOUNT_PAIRS_G2: [number, number][] = [
  [1, 1000],
  [2, 1000],
  [3, 923],
  [4, 884],
  [5, 855],
  [6, 832],
  [7, 812],
  [8, 796],
  [9, 782],
  [10, 770],
  [11, 759],
  [12, 749],
  [13, 740],
  [14, 732],
  [15, 724],
  [16, 717],
  [17, 711],
  [18, 704],
  [19, 699],
  [20, 693],
  [21, 688],
  [22, 683],
  [23, 679],
  [24, 674],
  [25, 670],
  [26, 666],
  [27, 663],
  [28, 659],
  [29, 655],
  [30, 652],
  [31, 649],
  [32, 646],
  [33, 643],
  [34, 640],
  [35, 637],
  [36, 634],
  [37, 632],
  [38, 629],
  [39, 627],
  [40, 624],
  [41, 622],
  [42, 620],
  [43, 618],
  [44, 615],
  [45, 613],
  [46, 611],
  [47, 609],
  [48, 607],
  [49, 606],
  [50, 604],
  [51, 602],
  [52, 600],
  [53, 598],
  [54, 597],
  [55, 595],
  [56, 593],
  [57, 592],
  [58, 590],
  [59, 589],
  [60, 587],
  [61, 586],
  [62, 584],
  [63, 583],
  [64, 582],
  [65, 580],
  [66, 579],
  [67, 578],
  [68, 576],
  [69, 575],
  [70, 574],
  [71, 573],
  [72, 571],
  [73, 570],
  [74, 569],
  [75, 568],
  [76, 567],
  [77, 566],
  [78, 565],
  [79, 563],
  [80, 562],
  [81, 561],
  [82, 560],
  [83, 559],
  [84, 558],
  [85, 557],
  [86, 556],
  [87, 555],
  [88, 554],
  [89, 553],
  [90, 552],
  [91, 552],
  [92, 551],
  [93, 550],
  [94, 549],
  [95, 548],
  [96, 547],
  [97, 546],
  [98, 545],
  [99, 545],
  [100, 544],
  [101, 543],
  [102, 542],
  [103, 541],
  [104, 541],
  [105, 540],
  [106, 539],
  [107, 538],
  [108, 537],
  [109, 537],
  [110, 536],
  [111, 535],
  [112, 535],
  [113, 534],
  [114, 533],
  [115, 532],
  [116, 532],
  [117, 531],
  [118, 530],
  [119, 530],
  [120, 529],
  [121, 528],
  [122, 528],
  [123, 527],
  [124, 526],
  [125, 526],
  [126, 525],
  [127, 524],
  [128, 524],
]
