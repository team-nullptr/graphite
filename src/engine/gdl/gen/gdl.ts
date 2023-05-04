// This file was generated by lezer-generator. You probably shouldn't edit it.
import { LRParser } from "@lezer/lr";
export const parser = LRParser.deserialize({
  version: 14,
  states:
    "#YQYQPOOO_QPO'#C_OOQO'#Cj'#CjOOQO'#Cf'#CfQYQPOOOOQO,58y,58yOmQPO,58|OrQPO,58}OwQPO,59OOOQO-E6d-E6dOOQO1G.h1G.hO|QPO1G.iOOQO1G.j1G.jO!UQPO7+$TO!ZQPO7+$VOOQO<<Go<<GoOOQO<<Gq<<Gq",
  stateData: "!`~O]OSPOS~OSPO~OTTO_UO`VObWO~OSYO~OTZO~OS[O~Oa]Oc^O~OS_O~OS`O~O",
  goto: "n_PPP`PP````dPPPjTQOSQSORXSTROS",
  nodeNames:
    "⚠ LineComment Program Vertex Id Value Edge WeightedEdge DirectedEdge WeightedDirectedEdge",
  maxTerm: 19,
  nodeProps: [["group", -5, 3, 6, 7, 8, 9, "Statement"]],
  skippedNodes: [0, 1],
  repeatNodeCount: 1,
  tokenData:
    "%j~RbX^!Zpq!Z}!O#O!P!Q#Z!Q![#x!^!_$Q!c!}$c!}#O$n#P#Q$s#T#o$c#y#z!Z$f$g!Z#BY#BZ!Z$IS$I_!Z$I|$JO!Z$JT$JU!Z$KV$KW!Z&FU&FV!Z~!`Y]~X^!Zpq!Z#y#z!Z$f$g!Z#BY#BZ!Z$IS$I_!Z$I|$JO!Z$JT$JU!Z$KV$KW!Z&FU&FV!Z~#RP!`!a#U~#ZO_~~#^P!P!Q#a~#fSP~OY#aZ;'S#a;'S;=`#r<%lO#a~#uP;=`<%l#a~#}PT~!Q![#x~$TP}!O$W~$ZP!`!a$^~$cOb~~$hQS~!c!}$c#T#o$c~$sO`~~$vQ}!O$|!^!_%X~%PP!`!a%S~%XOa~~%[P}!O%_~%bP!`!a%e~%jOc~",
  tokenizers: [0],
  topRules: { Program: [0, 2] },
  tokenPrec: 0,
  termNames: {
    "0": "⚠",
    "1": "LineComment",
    "2": "@top",
    "3": "Vertex",
    "4": "Id",
    "5": "Value",
    "6": "Edge",
    "7": "WeightedEdge",
    "8": "DirectedEdge",
    "9": "WeightedDirectedEdge",
    "10": "statement+",
    "11": "␄",
    "12": "%mainskip",
    "13": "space",
    "14": "statement",
    "15": '"->"',
    "16": '"["',
    "17": '"]->"',
    "18": '"<->"',
    "19": '"]<->"',
  },
});
