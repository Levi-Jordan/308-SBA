const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  
  function getAssignmentScore(ag,id) {
    let pointsPossible = 0;
    for (a = 0; a < ag.assignments.length; a++) {
      if (ag.assignments[a].id === id) {
        return ag.assignments[a].points_possible;
      }
    }
    return NaN;
  }

  function checkDates(ag, id, date) {
    let dateDue = [];
    let result = [false, false]; 
    for (a = 0; a < ag.assignments.length; a++){
      if (ag.assignments[a].id === id) {
        dateDue = ag.assignments[a].due_at.split("-");
      }
    }
    let submissionDate = date.split("-")
    for (a = 0; a < dateDue.length; a++){
      if (submissionDate[a] <= dateDue[a]) {
        continue;
      } else {
        result[0] = true;
      }
    if (dateDue[0] >= 2025) {
      result[1] = true;
    }
  }
  return result;
}
  function getLearnerData(course, ag, submissions) {
    // here, we would process this data to achieve the desired result.
    let studentArray = [];
    let studentIDs = [];
    for (i = 0; i < submissions.length; i++){
      let data = {
        "student_id": submissions[i].learner_id,
        "assignment_id": submissions[i].assignment_id,
        "score": submissions[i].submission.score,
        "max_score": getAssignmentScore(ag, submissions[i].assignment_id),
        "late": checkDates(ag, submissions[i].assignment_id, submissions[i].submission.submitted_at)[0],
        "early": checkDates(ag, submissions[i].assignment_id, submissions[i].submission.submitted_at)[1]
      }
      if (data.early){
        continue;
      }
      if (data.late){
        data.score -= data.max_score * 0.10;
      }
      if (studentIDs.includes(data.student_id)){
        for (j = 0; j < studentArray.length; j++) {
          if (studentArray[j].id == data.student_id) {
            studentArray[j][data.assignment_id] = Number((data.score / data.max_score).toFixed(3));
            studentArray[j].running_score += data.score;
            studentArray[j].running_max += data.max_score;
          }
        }
      }
         else{
          let tempStudent = {
            "id": data.student_id,
            "avg": 0,
            [data.assignment_id]: Number ((data.score / data.max_score).toFixed(3)),
            "running_score": data.score,
            "running_max": data.max_score
          }
          studentIDs.push(data.student_id);
          studentArray.push(tempStudent);
        }
      }
      for (i = 0; i < studentArray.length; i++) {
        studentArray[i].avg = studentArray[i].running_score / studentArray[i].running_max;
        delete studentArray[i].running_score
        delete studentArray[i].running_max
      }
    return studentArray; 
  }

  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  
  console.log(result);

  // const result = [
  //   {
  //     id: 125,
  //     avg: 0.985, // (47 + 150) / (50 + 150)
  //     1: 0.94, // 47 / 50
  //     2: 1.0 // 150 / 150
  //   },
  //   {
  //     id: 132,
  //     avg: 0.82, // (39 + 125) / (50 + 150)
  //     1: 0.78, // 39 / 50
  //     2: 0.833 // late: (140 - 15) / 150
  //   }
  // ]; 