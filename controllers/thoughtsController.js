const { User, Thought, Reaction } = require('../models');
const { ObjectId } = require('mongoose').Types;

module.exports = {
    getThoughts(req, res) {
        Thought.find()
            .then(thoughts => {
                return res.json(thoughts)
            }).catch(err => {
                console.log(err);
                return res.status(500).json(err)
            })
    },
    getSingleThought(req, res) {
        Thought.findById(req.params.thoughtId)
            .then(thought => {
                if (!thought) {
                    res.status(404).json({ message: 'No thought with this Id.' })
                } else {
                    res.json(thought)
                }
            }).catch(err => {
                res.status(500).json(err)
            })
    },
    createThought(req, res) {
        User.findById(req.body.userId)
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'No user with this Id.' })
                } else {
                    Thought.create({
                        thoughtText: req.body.thoughtText,
                        username: req.body.username
                    })
                    .then(thought => {
                        User.findOneAndUpdate(
                            { _id: req.body.userId },
                            { $addToSet: { thoughts: thought._id } },
                            { runValidators: true, new: true }
                        ).then(user => {
                            res.json(thought)
                        })
                    })
                }
            })
            .catch(err => res.status(500).json(err))
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then(thought => {
            if (!thought) {
                res.status(404).json({ message: 'No thought with this Id.' })
            } else {
                res.json(thought)
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    },
    deleteThought(req, res) {
        User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        )
        .then(user => {
            Thought.findOneAndDelete({ _id: req.params.thoughtId })
                .then(thought => {
                    if (!thought) {
                        res.status(404).json({ message: 'No thought with this Id.' })
                    } else {
                        res.json({ message: 'Thought successfully deleted.' })
                    }
                })
        })
        .catch(err => {
            res.status(500).json(err)
        })
    },
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
        )
        .then(thought => {
            if (!thought) {
                res.status(404).json({ message: 'No thought with this Id.' })
            } else {
                res.json(thought)
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    },
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: { reactions: { reactionId: req.body.reactionId } } },
            { runValidators: true, new: true }
        )
        .then(thought => {
            if (!thought) {
                res.status(404).json({ message: 'No thought with this Id.' })
            } else {
                res.json(thought)
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
}