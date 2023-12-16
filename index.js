const express = require("express");
const app = express();
const port =  5000;

const bodyParser = require('body-parser');
const { performance } = require('perf_hooks');



app.use(express.json());
app.use(bodyParser.json());

// Define the sorting routes before the notFound and errorHandler middleware
function sortSequential(toSort) {
  return toSort.map(arr => arr.slice().sort((a, b) => a - b));
}

async function sortConcurrent(toSort) {
  const sortedArrays = [];
  const promises = toSort.map(async (arr, index) => {
    const sorted = await new Promise(resolve => {
      setTimeout(() => {
        resolve(arr.slice().sort((a, b) => a - b));
      }, 0);
    });
    sortedArrays[index] = sorted;
  });
  await Promise.all(promises);
  return sortedArrays;
}

app.post('/process-single', (req, res) => {
  const { to_sort: toSort } = req.body;

  const startTime = performance.now();
  const sortedArrays = sortSequential(toSort);
  const endTime = performance.now();

  res.status(200).json({
    sorted_arrays: sortedArrays,
    time_ns: `${endTime - startTime} nanoseconds`,
  });
});

app.post('/process-concurrent', async (req, res) => {
  const { to_sort: toSort } = req.body;

  const startTime = performance.now();
  const sortedArrays = await sortConcurrent(toSort);
  const endTime = performance.now();

  res.status(200).json({
    sorted_arrays: sortedArrays,
    time_ns: `${endTime - startTime} nanoseconds`,
  });
});





app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
