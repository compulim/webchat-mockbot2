// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory, TurnContextStateCollection } = require('botbuilder');

export default class EchoBot extends ActivityHandler {
  constructor() {
    super();

    // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
    this.onMessage(async (context, next) => {
      const replyText = `Echo: ${context.activity.text || ''}`;

      const activities = [MessageFactory.text(replyText, replyText)];

      // Echo back every activity.
      const { attachments } = context.activity;

      if (attachments && attachments.length) {
        activities.push(
          ...attachments.map((attachment, index) =>
            MessageFactory.attachment(
              attachment,
              `Attachment ${index + 1}: \`${attachment.name}\` of type \`${attachment.contentType}\``
            )
          )
        );
      }

      await context.sendActivities(activities);

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      const welcomeText = 'Hello and welcome!';
      const welcomeTextInChinese = '您好，欢迎！';

      for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
        if (membersAdded[cnt].id !== context.activity.recipient.id) {
          if (context.activity.locale === 'zh-CN' || context.activity.locale === 'zh-Hans') {
            await context.sendActivity(MessageFactory.text(welcomeTextInChinese, welcomeTextInChinese));
          } else {
            await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
          }
        }
      }

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }
}
