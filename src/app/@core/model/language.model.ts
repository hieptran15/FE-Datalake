export interface ILanguage {
  langKey?: string
  langTitle?: string
}

export class Language implements ILanguage {
  constructor(
    public langKey?: string,
    public langTitle?: string
    ) { }
}
