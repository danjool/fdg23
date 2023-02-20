let lineReader = require('line-reader')
const pool = require("../dbPool")
const SQL = require('sql-template-strings')

let filePath = 'E:/dev-projects/fdg3/concept-server/database/data/assertions.csv'
let rowCount = 0 
let languages = new Set()
let relations = new Set()
let concepts = new Set()
let assertions = new Set()

const convertCSVtoSQL = async ( pool ) => {

    lineReader.eachLine( filePath, function(line) {
        let words= line.split('\t')
        let relation = words[1].replace('/r/', '').replaceAll("'", "'").replaceAll("'", "''")
        const sourceWords = words[2].split('/')
        const targetWords = words[3].split('/')
        const sourceLanguage = sourceWords[2]
        const targetLanguage = targetWords[2]
        const source = sourceWords[3].replaceAll("'", "'").replaceAll("'", "''")
        const target = targetWords[3].replaceAll("'", "'").replaceAll("'", "''")
        let json, weight, dataset
        try {
            json = JSON.parse(words[4])
            weight = json.weight
            dataset
        } catch(err){
            weight = .89
            dataset = 'unknown'
        }
        // console.log(words, relation, source, target, weight, language);

        if(sourceLanguage === 'en' && targetLanguage === 'en' && weight >= .9){ //&& source !== 'church'
            rowCount +=1 
            if(rowCount%10000 === 0){ console.log("importing", rowCount, rowCount/3420000, source, relation, target, sourceLanguage, targetLanguage, concepts.size, relations.size) }
            // concepts.add(source)
            // concepts.add(target)
            // relations.add(relation)
            insertConcept(source, pool)
            insertConcept(target, pool)
            insertRelation(relation, source, target, pool)
        }
    
    })
}

async function insertConcept(concept, pool){
    if( !concepts.has(concept) ){
        let query = `INSERT INTO nodes(label) VALUES ($1) ON CONFLICT DO NOTHING;;`
        try {        
            // console.log("insertConcept", concept)     
            await pool.query(query, [concept])
            // concepts.add(concept)
        } catch(err){
            console.log(concept, ">>",  err)
        }
    }
}

async function insertRelation(relation, source, target, pool){
    if( !relations.has(relation) ){        
        try {        
            let q = `INSERT INTO relations (label) VALUES ($1) ON CONFLICT DO NOTHING;`
            // console.log("insertRelation", relation, relations.has(relation) )
            await pool.query(q, [relation])
            // relations.add(relation)
        } catch(err){
            console.log(relation, "rel>>",  err)
        }
    }
    let query = `INSERT INTO edges (source_id, target_id, relation_id) VALUES (
    (SELECT id FROM nodes WHERE label = $1 limit 1), 
    (SELECT id FROM nodes WHERE label = $2 limit 1), 
    (SELECT id FROM relations WHERE label = $3 limit 1)) ON CONFLICT DO NOTHING; `        
    try {        
        // console.log("insert assertions", source, target, relation)
        await pool.query(query, [source, target, relation])
        // relations.add(relation)
    } catch(err){
        console.log(relation, "ass>>",  source, target, query,  err)
    }
}

const convert = async () => {
    console.log("convert")

    await convertCSVtoSQL(pool)
    // pool.end()
}
convert()