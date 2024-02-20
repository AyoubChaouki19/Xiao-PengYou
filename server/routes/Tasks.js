const express = require("express");
const router = express.Router();
const { Tasks } = require("../models");
router.post("/", async (req, res) => {
  const task = req.body;
  await Tasks.create(task);
  res.json(task);
});
router.get("/", async (req, res) => {
  try {
    const tasks = await Tasks.findAll();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.delete("/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    const deletedRows = await Tasks.destroy({
      where: { id: taskId },
    });
    if (deletedRows > 0) {
      res.status(204).send();
    } else {
      // If no rows are deleted, the task was not found
      res.status(404).json({ error: "TASK NOT FOUND" });
    }
  } catch (error) {
    res.status(500).json({ error: "SERVER ERROR" });
  }
});
router.put("/completed/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    console.log("Tried");
    const task = await Tasks.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: "TASK DO NOT EXIST" });
    }
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    console.log("catched error");
    console.log("Error updating task", error);
    res.status(500).json({ error: "SERVER ERROR" });
  }
});
module.exports = router;
