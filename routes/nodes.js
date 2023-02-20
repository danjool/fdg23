const Router = require("express-promise-router")
const pool = require("../database/dbPool.js")
const SQL = require('sql-template-strings')

const router = new Router()
module.exports = router

// INDEX gets all the nodes
router.post("/query", async (req, res) => {
  try {
    // const { conceptString, maxEdges, minEdges } = req.body
    const results = await pool.query(SQL`
    select * from nodes n join edges e on e.target_id = n.id limit 100
    `, [])
    
    res.json({ 
      nodes: results.rows } )
  } catch (err) {
    console.error(err)
  }
})

// SHOW gets one concept by Id
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    console.log("concepts.js get /:id", id)
    const relations = await pool.query(
      `SELECT r.id as relation_id
        , c.id as source_id
        , c.name as source
        , r.name as relation
        , t.id as target_id
        , t.name as target
        , a.weight, a.dataset, a.id as assertion_id
        , case when c.id = $1 then c.name else t.name end as concept_name
      FROM dbo.concepts c 
      JOIN dbo.assertions a on a.source_concept_id = c.id AND a.deleted_at IS NULL
      JOIN dbo.concepts t on t.id = a.target_concept_id
      JOIN dbo.relations r on r.id = a.relation_id
      WHERE c.id = $1 OR t.id = $1`,
      [id]
    )
    const concept = { concept_id: id, id: relations.rows[0]['concept_name'] }
    res.json( { concept: concept, relations: relations.rows } )
  } catch (err) {
    console.error(err)
  }
})

// get a concept and all its projects
// router.get("/:id/assertions", async (req, res) => {
//   const { id } = req.params
//   try {
//     const projects = await pool.query(
//       `
//         SELECT p.id, p.name, c.name as concept_name
//         FROM todo.projects p
//         JOIN todo.concepts c on c.id = p.concept_id
//         WHERE c.id = $1
//       `,
//       [id]
//     )
//     res.json(projects.rows)
//   } catch (err) {
//     console.error(err)
//   }
// })

// router.get(
//   "/:conceptId/projects/:projectId/tasks",
//   authorization,
//   authentication,
//   async (req, res) => {
//     const { conceptId, projectId } = req.params
//     try {
//       const tasks = await pool.query(
//         `
//             SELECT t.id, t.description
//             FROM todo.tasks t
//             WHERE t.project_id = $1
//             `,
//         [projectId]
//       )
//       res.json(tasks.rows)
//     } catch (err) {
//       console.error(err)
//     }
//   }
// )

// SAVE makes a new concept with supplied properties
router.post("/", async (req, res) => {
  try {
    const { name } = req.body
    const concept = await pool.query(
      "INSERT INTO nodes(label) VALUES ($1) RETURNING *;",
      [name]
    )
    res.json(concept.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})

// UPDATE an existing intance of a concept with new information supplied
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body
    const { id } = req.params
    const concept = await pool.query(
      "UPDATE dbo.concepts SET name = $2 WHERE id = $1 RETURNING *",
      [id, name]
    )
    res.json(concept.rows[0])
  } catch (err) {
    console.error(err.message)
  }
})

// DELETE removes a concept by Id
router.delete("/:id", async (req, res) => {
  const realDeleteQuery = "DELETE FROM dbo.concepts WHERE id = $1;"
  
  try {
    const { id } = req.params
    const deletedconcept = await pool.query(
      `UPDATE dbo.concepts SET deleted_at = NOW() WHERE id = $1;`,
      [id]
    )
    await pool.query(
      `UPDATE dbo.assertions SET deleted_at = NOW() WHERE source_concept_id = $1 OR target_concept_id = $1;`,
      [id]
    )
    res.json("Concept Deleted! " + id)
  } catch (err) {
    console.error(err.message)
  }
})
