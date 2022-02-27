export interface IJob {
  base64Img?: string;
  base64File?: string;
  description?: string;
  jobFile?: string;
  jobId?: any;
  fileURL?: string;
  jobName?: string;
  oldFile?: string;
  oldImage?: string;
}

export class Job implements IJob {
  constructor(
    public base64Img?: string,
    public base64File?: string,
    public description?: string,
    public jobFile?: string,
    public jobId?: any,
    public fileURL?: string,
    public jobName?: string,
    public oldImage?: string,
    public oldFile?: string,
  ) {
  }
}
