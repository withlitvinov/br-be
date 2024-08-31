type PipelineJobFn = () => boolean;

type PipelineJobFnPromise = () => Promise<boolean>;

type PipelineJob =
  | PipelineJobFn
  | PipelineJobFnPromise
  | boolean
  | string
  | object
  | null
  | undefined;

const pipeline = async (jobs: PipelineJob[]) => {
  for (const job of jobs) {
    const result = await Promise.resolve(
      typeof job === 'function' ? job() : job,
    );

    if (!result) {
      return false;
    }
  }

  return true;
};

export { pipeline };
