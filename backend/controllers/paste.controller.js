const Paste = require('../models/paste');
const { nanoid } = require('nanoid');

exports.createPaste = async (req, res) => {
  try {
    const { content } = req.body;
    const pasteId = nanoid(8);

    const paste = new Paste({ content, pasteId });
    await paste.save();

    res.status(201).json({
      message: 'Paste created',
      pasteId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPaste = async (req, res) => {
  try {
    const { pasteId } = req.params;

    const paste = await Paste.findOne({ pasteId });

    if (!paste) {
      return res.status(404).json({ message: 'Paste not found or expired.' });
    }

    return res.status(200).json({ 
        content: paste.content,
        createdAt: paste.createdAt 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
