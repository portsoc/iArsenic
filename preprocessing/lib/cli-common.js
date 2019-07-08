const commandLineArgs = require('command-line-args');
const path = require('path');

const DEFAULT_MODEL = 'model3';

const optionDefinitions = [
  { name: 'help', alias: 'h', type: Boolean },
  {
    name: 'paths',
    alias: 'p',
    type: String,
    defaultOption: true,
    multiple: true,
  },
  {
    name: 'model',
    alias: 'm',
    type: String,
    defaultValue: DEFAULT_MODEL,
  },
];

function usage() {
  console.log(`Available command-line options:

Options:

  -h, --help               Show this help

  -m modelid
  --model=modelid          Use model <modelid> instead of the default.
                           Too see what models are available, look in models/

  [-p] path1 path2 ...
                           Use the given CSV files as input data.
`.trim());
}

const options = commandLineArgs(optionDefinitions);

if (options.help) {
  usage();
  process.exit(0);
}

function getParameters() {
  options.model = loadModelScripts(options.model);
  return options;
}

function loadModelScripts(model) {
  const preprocessorPath = path.join(__dirname, '..', 'models', model + '-preprocessor');
  const estimatorPath = path.join(__dirname, '..', 'models', model + '-estimator');

  try {
    return {
      preprocessor: require(preprocessorPath),
      estimator: require(estimatorPath),
    };
  } catch (e) {
    console.error(`error: cannot find model '${model}-preprocessor' or '${model}-estimator'`);
    console.error(`in ${path.join(__dirname, '..', 'models')}`);
    process.exit(1);
  }
}

module.exports = {
  getParameters,
};
