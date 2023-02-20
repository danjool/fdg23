const fs = require('fs')
const path = require('path')
const { parse } = require('fast-csv')

let rows = [];
let filename = 'E:/dev-projects/fdg3/concept-server/database/data/assertions.csv'

let concepts = new Set()
let relations = new Set()
let i = 0

fs.createReadStream(path.resolve( __dirname, filename ))
  .pipe(parse({ 
    headers: false, 
    delimiter: '	', 
    skipLines: 0,
    maxRows: 10000000
}))
  .on('error', error => console.error(error))
  .on('data', row => {
      i += 1
    //   if (i %100 === 0) {
    //     //   console.log("i", i, relations.size, concepts.size)
    //       relations.forEach(r=>console.log(r))
    //       i = 0
    //     }
      if( row && row.length > 4 ){
        const relation = row[1]
        const from = row[2]
        const   to = row[3]

        const relationParts = relation.split('/')
        const fromParts     = from.split('/')
        const   toParts     =   to.split('/')

        const fromLang = fromParts[2]
        const toLang = toParts[2]

        const rel = relationParts[2]
        const fromWord = fromParts[3]
        const toWord = toParts[3]

        const fromSpeechPart = fromParts[4]

        if (fromLang === 'en' && toLang === 'en' && 
            fromParts.length === 4 && toParts.length === 4 
            // && rel !== 'Antonym'
            // && rel !== 'AtLocation'
            // && rel !== 'CapableOf'
            // && rel !== 'DerivedFrom'
            // && rel !== 'DerivedFrom'
            // && rel !== 'EtymologicallyDerivedFrom'
            // && rel !== 'Causes'            
            // && rel !== 'CausesDesire'
            // && rel !== 'DefinedAs'            
            && rel === 'IsA'
            ){ 

                console.log("i", i, relations.size, concepts.size
                , fromWord, toWord, rel
            )

            concepts.add(from)
            // relations.add(rel)
            console.log('relation', fromLang, toLang, rel, fromWord, toWord, concepts.size, i)
        }
        //each row can be written to db
        rows.push(row);
      }
      
  })
  .on('end', rowCount => {
      console.log(`Parsed ${rowCount} rows`);
    // concepts.forEach(c=>console.log(c))
    relations.forEach(r=>console.log(r))
  });

  /**
  /a/[/r/Antonym/,/c/ab/агыруа/n/,/c/ab/аҧсуа/]	/r/Antonym	/c/ab/агыруа/n	/c/ab/аҧсуа	{"dataset": "/d/wiktionary/en", "license": "cc:by-sa/4.0", "sources": [{"contributor": "/s/resource/wiktionary/en", "process": "/s/process/wikiparsec/2"}], "weight": 1.0}
  */