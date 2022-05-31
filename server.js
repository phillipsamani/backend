const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const subjectRoutes = require('./routes/subject');
const yearRoutes = require("./routes/year");
const strandRoutes = require("./routes/strand");
const syllabusRoutes = require("./routes/syllabus");
const sectionRoutes = require("./routes/section");
const forewordRoutes = require("./routes/foreword");
const acknowledgementRoutes = require("./routes/acknowledgement");
const introductionRoutes = require("./routes/introduction");
const rationaleRoutes = require("./routes/rationale");
const aimsRoutes = require("./routes/aim");
const substrandRoutes = require("./routes/substrand");
const termRoutes = require("./routes/term");
const outcomeRoutes = require("./routes/outcome");
const indicatorRoutes = require("./routes/indicator");       

// app
const app = express();


// { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true }
// db
mongoose
    .connect(process.env.DATABASE_LOCAL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('DB connected......'))
    .catch(err => {
        console.log(err);
    });

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());

// cors
if (process.env.NODE_ENV === 'development') {
    app.use(cors({ origin: `${process.env.CLIENT_URL}` }));
}

// routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', subjectRoutes);
app.use("/api", yearRoutes);
app.use("/api", strandRoutes);
app.use("/api", syllabusRoutes);
app.use("/api", sectionRoutes);
app.use("/api", forewordRoutes);
app.use("/api", acknowledgementRoutes);
app.use("/api", introductionRoutes);
app.use("/api", rationaleRoutes);
app.use("/api", aimsRoutes);
app.use("/api", substrandRoutes);
app.use("/api", termRoutes);
app.use("/api", outcomeRoutes);
app.use("/api", indicatorRoutes);

// port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});