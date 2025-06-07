import Task from "../Model/taskModel.js";


//CREATE TASK 

export const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate, completed } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Title is required' });
        }

        const task = new Task({
            title,
            description,
            priority,
            dueDate,
            owner: req.user.id,
            completed: completed === 'yes' || completed === true,
        });

        await task.save();  // ✅ save to DB

        res.status(201).json({ success: true, message: 'Task created successfully', task });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

//GET ALL TASK 

export const getTask = async (req, res) => {
    try {
        const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, tasks });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

//GET SINGLE TASK (MUST BELONG TO THAT USER)

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        res.status(200).json({ success: true, task });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

//UPDATE A TASK 

export const updateTask = async (req, res) => {
    try {
   
        
        const data = { ...req.body };

        if (data.completed !== undefined) {
            data.completed = data.completed === 'yes' || data.completed === true;
        }

        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, owner: req.user.id }, 
            data,
            { new: true, runValidators: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ success: false, message: 'Task not found or not authorized' });
        }

        res.status(200).json({ success: true, task: updatedTask });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}


//DELECT TASK 

export const delectTask = async (req, res) => {
    try {

        const delect =await  Task.findByIdAndDelete({ _id: req.params.id, owner: req.user.id });

        if (!delect) return res.status(404).json({ success: false, message: 'Action failed' });

        res.status(200).json({ success: true, message: "Task deleted" });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}