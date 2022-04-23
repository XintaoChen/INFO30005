const Record = require("../models/record");
const HealthData = require("../models/healthData");
const Patient = require("../models/patient");
const { post } = require("../routes/patientRouter");

const getOneRecordBypatientId = async (req, res) => {
  try {
    const { patientId, date, healthDataId } = req.query;
    console.log(patientId, healthDataId);
    const record = await Record.findOne(
      {
        patientId: patientId,
        date: new Date(date),
        healthDataId: healthDataId,
      },
      "value comment"
    );
    if (record) {
      let { unit } = await HealthData.findById(healthDataId);
      let { _id, value, comment } = record;
      const data = { _id, value, unit };
      if (!comment && comment.length !== 0) {
        res.json({
          status: 0,
          data: data,
        });
      } else {
        res.json({
          status: 1,
          data: data,
        });
      }
    } else {
      res.json({
        status: 2,
        msg: "record not yet filled",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const getCommentList = async (req, res) => {
  try {
    const { clinicianId } = req.query;
    const pageNum = Number(req.query.pageNum);
    const pageSize = Number(req.query.pageSize);

    const total = await Record.find({
      clinicianId: clinicianId,
    }).countDocuments();
    const records = await Record.find({ clinicianId: clinicianId })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize);
    if (!records) {
      res.json({
        status: 1,
        msg: "error",
      });
    } else {
      const data = await Promise.all(
        records.map(async (record) => {
          const { profileName } = await Patient.findById(record.patientId);
          const { dataName, unit } = await HealthData.findById(
            record.healthDataId
          );
          return {
            patientId: record.patientId,
            patientName: profileName,
            dataType: dataName,
            value: record.value,
            unit: unit,
            comment: record.comment,
            date: record.date,
          };
        })
      );
      res.json({
        status: 0,
        total: total,
        data: data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const postUpdateRecordValue = async (req, res) => {
  
  const newRecord = new Record({
    patientId: req.body.patientId,
    healthDataId: req.body.patientId,
    clinicianId: req.body.patientId,
    timestamps: req.body.timestamps,
    value: req.body.value,
    comment: req.body.comment
  }) 

  try {
    const savedRecord = await post.save()
    res.json({
      status: 0,
      data: savedRecord
    });
  } catch (error) {
    console.log(err)
  }

}

module.exports = { getOneRecordBypatientId, getCommentList, postUpdateRecordValue };
