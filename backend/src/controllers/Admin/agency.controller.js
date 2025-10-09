

const addAgencyController = async (req, res) => {
    try {
        res.status(201).json({
            status: "ok",
            message: "Add agency Route"
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message
        })
    }
}

module.exports = {
    addAgencyController
}