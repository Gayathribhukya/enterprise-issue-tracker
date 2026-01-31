const express = require("express");
const app = express();

const db = require("./db");

app.use(express.json());

/* ✅ TEST ROUTE */
app.get("/test", (req, res) => {
  res.send("Server is working");
});

/* ✅ CREATE ISSUE API */
app.post("/issues", (req, res) => {
  const { title, description, category, priority, created_by } = req.body;

  const sql = `
    INSERT INTO issues (title, description, category, priority, created_by)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, description, category, priority, created_by], (err) => {
    if (err) {
      console.error("MYSQL ERROR 👉", err);
      return res.status(500).send(err.message);
    }
    res.send("Issue created successfully");
  });
});

app.put("/issues/:id/status", (req, res) => {
  const issueId = req.params.id;
  const { new_status } = req.body;

  // 1) Get current status & priority
  db.query(
    "SELECT status, priority, created_at FROM issues WHERE issue_id = ?",
    [issueId],
    (err, rows) => {
      if (err) return res.status(500).send(err.message);
      if (rows.length === 0) return res.status(404).send("Issue not found");

      const oldStatus = rows[0].status;

      // 2) Update status
      db.query(
        "UPDATE issues SET status = ? WHERE issue_id = ?",
        [new_status, issueId],
        (err) => {
          if (err) return res.status(500).send(err.message);

          // 3) Insert status history (audit)
          db.query(
            `INSERT INTO issue_status_history (issue_id, old_status, new_status)
             VALUES (?, ?, ?)`,
            [issueId, oldStatus, new_status]
          );

          // 4) If RESOLVED → calculate SLA
          if (new_status === "RESOLVED") {
            const slaSql = `
              SELECT 
                TIMESTAMPDIFF(HOUR, i.created_at, NOW()) AS hours_taken,
                s.sla_hours
              FROM issues i
              JOIN sla_rules s ON i.priority = s.priority
              WHERE i.issue_id = ?
            `;

            db.query(slaSql, [issueId], (err, result) => {
              if (err) return res.status(500).send(err.message);

              const { hours_taken, sla_hours } = result[0];
              const slaStatus = hours_taken <= sla_hours ? "MET" : "BREACHED";

              db.query(
                `UPDATE issues 
                 SET resolved_at = NOW(), sla_status = ?
                 WHERE issue_id = ?`,
                [slaStatus, issueId],
                (err) => {
                  if (err) return res.status(500).send(err.message);
                  res.send("Status updated & SLA calculated");
                }
              );
            });
          } else {
            res.send("Status updated");
          }
        }
      );
    }
  );
});

/* ✅ SERVER START — THIS WAS MISSING */
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
