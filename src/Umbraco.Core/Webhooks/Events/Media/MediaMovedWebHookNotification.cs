﻿using Microsoft.Extensions.Options;
using Umbraco.Cms.Core.Configuration.Models;
using Umbraco.Cms.Core.Models;
using Umbraco.Cms.Core.Notifications;
using Umbraco.Cms.Core.Services;
using Umbraco.Cms.Core.Sync;

namespace Umbraco.Cms.Core.Webhooks.Events.Media;

public class MediaMovedWebhookEvent : WebhookEventContentBase<MediaMovedNotification, IMedia>
{
    public MediaMovedWebhookEvent(
        IWebhookFiringService webhookFiringService,
        IWebHookService webHookService,
        IOptionsMonitor<WebhookSettings> webhookSettings,
        IServerRoleAccessor serverRoleAccessor)
        : base(
            webhookFiringService,
            webHookService,
            webhookSettings,
            serverRoleAccessor,
            "Media Moved")
    {
    }

    protected override IEnumerable<IMedia> GetEntitiesFromNotification(MediaMovedNotification notification) => notification.MoveInfoCollection.Select(x => x.Entity);

    protected override object ConvertEntityToRequestPayload(IMedia entity) => new DefaultPayloadModel { Id = entity.Key };
}
