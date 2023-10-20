declare module 'node-mailjet' {
    var mailjet: {
      connect: (apiKey: string, apiSecret: string) => any;
    };
    export = mailjet;
  }