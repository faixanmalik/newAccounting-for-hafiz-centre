const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    projectName:{type: String},
    projectDesc:{type: String},
    
  },{timestamps:true});

mongoose.models={}
export default mongoose.model("Project", ProjectSchema);