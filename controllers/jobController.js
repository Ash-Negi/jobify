import Job from '../models/JobModels.js';
import { StatusCodes } from 'http-status-codes';
import mongoose from 'mongoose';
import day from 'dayjs'

export const getAllJobs = async (req,res) => {
    const {search, jobStatus, jobType, sort} = req.query;

    const queryObject = {
        createdBy: req.user.userID,
    }

    if(search){
        //$or is mongo syntax
        //if there was something in search param it will look for that between the values below
        //else this gets skipped
        queryObject.$or = [
            {position:{$regex: search, $options: 'i'}},
            {company:{$regex: search, $options: 'i'}}
        ]
    }

    if(jobStatus && jobStatus != 'all'){
        queryObject.jobStatus = jobStatus
    }
    if(jobType && jobType != 'all'){
        queryObject.jobType = jobType
    }

    //values below already set in constants
    const sortOptions = {
        newest: '-createdAt',
        oldest: 'createdAt',
        'a-z': 'position',
        'z-a': '-position',
    };

    const sortKey = sortOptions[sort] || sortOptions.newest

    //setup pagination

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit; //skip jobs before desired page

    //if empty finds all instances
    //otherwise find job's specific to user reflected by cookie
    const jobs = await Job.find(queryObject).sort(sortKey).skip(skip).limit(limit)

    const totalJobs = await Job.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalJobs/limit)

    res.status(StatusCodes.OK).json({totalJobs, numOfPages, currentPage:page , jobs})
};

export const createJob = async (req,res) => {
        req.body.createdBy = req.user.userID
        const job = await Job.create(req.body)
        //when creating a resource you got with 201
        res.status(StatusCodes.CREATED).json({job})
}

export const getJob = async (req,res) => {
    const { id } = req.params

    const job = await Job.findById(id)

    res.status(StatusCodes.OK).json({ job })
}

export const updateJob = async (req,res) => {
    const {id} = req.params
    const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
        new:true
    })
    res.status(StatusCodes.OK).json({ msg: 'job modified', updatedJob });
};

export const deleteJob = async (req,res) =>{
    const {id} = req.params
    const removedJob = await Job.findByIdAndDelete(id)
    res.status(StatusCodes.OK).json({msg: 'job deleted',job: removedJob})
};

export const showStats = async (req, res) => {

    let stats = await Job.aggregate([
        {$match: {createdBy: new mongoose.Types.ObjectId(req.user.userID) } },
        {$group: {_id:'$jobStatus', count:{$sum : 1}}},
    ])

    stats = stats.reduce((acc, curr)=>{
        const {_id: title, count } = curr
        acc[title] = count;
        return acc;
    },{})
    console.log(stats)


    const defaultStats = {
        pending: stats.pending || 0,
        interview: stats.interview || 0,
        declined: stats.declined || 0,
      };


    let monthlyApplications = await Job.aggregate([
        {$match: { createdBy: new mongoose.Types.ObjectId(req.user.userID)}},

        {$group: {
            _id: { year: { $year: '$createdAt'},
                   month: { $month: '$createdAt' } },
            count: {$sum: 1},
            },
        },
        {$sort: {'_id.year':-1, '_id.month': -1 }},
        {$limit: 6}
    ])

    monthlyApplications = monthlyApplications.map((item) => {
        //each object in monthly applications is an item with properties.  Destructure below
        const {_id:{year, month}, count} = item

        //dayJS will format date

        const date = day().month(month - 1).year(year).format('MMM YY')

        return {date, count}
    }).reverse()

    //   let monthlyApplications = [
    //     {
    //       date: 'May 23',
    //       count: 12,
    //     },
    //     {
    //       date: 'Jun 23',
    //       count: 9,
    //     },
    //     {
    //       date: 'Jul 23',
    //       count: 3,
    //     },
    //   ];

      res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
}