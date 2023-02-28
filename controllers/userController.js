const { User, Thought } = require('../models');

module.exports = {
    getUsers(req, res) {
        User.find()
            .populate({ path: 'friends' })
            .populate({ path: 'thoughts' })
            .then(users => {
                return res.json(users)
            })
            .catch(err => {
                console.log(err);
                return res.status(500).json(err)
            })
    },
    getSingleUser(req, res) {
        User.findById(req.params.userId)
            .populate({ path: 'friends' })
            .populate({ path: 'thoughts' })
            .then(user => {
                if (!user) {
                    res.status(404).json({ message: 'No user with this Id' })
                } else {
                    res.json(user)
                }
            })
            .catch(err => {
                res.status(500).json(err)
            })
    },
    createUser(req, res) {
        User.create(req.body)
            .then(user => res.json(user))
            .catch(err => res.status(500).json(err))
    },
    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'No user with this Id' })
            } else {
                res.json(user)
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    },
    deleteUser(req, res) {
        User.findOneAndDelete(req.params.userId)
            .then(user => {
                if (!user) {
                    res.status(400).json({ message: 'No user with such Id' })
                } else {
                    Thought.deleteMany({ _id: { $in: user.thoughts } })
                        .then(() => res.json({ message: 'User and their thoughts successfully deleted' }))
                }
            })
            .catch(err => {
                res.status(500).json(err)
            })
    },
    addFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'No user with this Id' })
            } else {
                res.json(user)
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    },
    removeFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'No user with this Id' })
            } else {
                res.json(user)
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
    }
}