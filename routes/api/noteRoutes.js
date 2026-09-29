const router = require("express").Router();

const { Note } = require("../../models");
const { authMiddleware } = require("../../utils/auth");

// Every notes route requires a valid JWT.
router.use(authMiddleware);

// GET /api/notes
// Return only notes owned by the logged-in user.
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve notes.",
    });
  }
});

// POST /api/notes
// Automatically associate the note with the logged-in user.
router.post("/", async (req, res) => {
  try {
    const note = await Note.create({
      title: req.body.title,
      content: req.body.content,
      user: req.user._id,
    });

    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// PUT /api/notes/:id
router.put("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "No note found with this id.",
      });
    }

    // Authentication tells us WHO the requester is.
    // This check determines whether they are AUTHORIZED.
    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "User is not authorized to update this note.",
      });
    }

    if (req.body.title !== undefined) {
      note.title = req.body.title;
    }

    if (req.body.content !== undefined) {
      note.content = req.body.content;
    }

    await note.save();

    res.json(note);
  } catch (error) {
    res.status(500).json({
      message: "Unable to update note.",
    });
  }
});

// DELETE /api/notes/:id
router.delete("/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: "No note found with this id.",
      });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "User is not authorized to delete this note.",
      });
    }

    await note.deleteOne();

    res.json({
      message: "Note deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to delete note.",
    });
  }
});

module.exports = router;
