<template>
  <q-item clickable v-ripple v-if="notification.type === 'recommendation'">
    <q-item-section avatar top right>
      <q-icon color="positive" name="fas fa-check" size="md" />
    </q-item-section>

    <q-item-section avatar>
      <q-avatar class="q-mb-sm">
        <img :src="notification.avatar">
      </q-avatar>
      <q-item-label><span class="text-weight-bold">{{ notification.user }}</span> recommended your <span class="text-weight-bold">post</span>.</q-item-label>
      <q-item-label caption>{{ notification.content }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-item clickable v-ripple v-else-if="notification.type === 'helpful-comment'">
    <q-item-section avatar top right>
      <q-icon color="positive" name="far fa-smile" size="md" />
    </q-item-section>

    <q-item-section avatar>
      <q-avatar class="q-mb-sm">
        <img :src="notification.avatar">
      </q-avatar>
      <q-item-label><span class="text-weight-bold">{{ notification.user }}</span> found your comment helpful.</q-item-label>
      <q-item-label caption>{{ notification.content }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-item clickable v-ripple v-else-if="notification.type === 'helpful-recommendation'">
    <q-item-section avatar top right>
      <q-icon color="positive" name="far fa-smile" size="md" />
    </q-item-section>

    <q-item-section avatar>
      <q-avatar class="q-mb-sm">
        <img :src="notification.avatar">
      </q-avatar>
      <q-item-label><span class="text-weight-bold">{{ notification.user }}</span> found your recommendation helpful.</q-item-label>
      <q-item-label caption>{{ notification.content }}</q-item-label>
    </q-item-section>

    <q-separator />
  </q-item>

  <q-item clickable v-ripple v-else-if="notification.type === 'flag'">
    <q-item-section avatar top right>
      <q-icon color="negative" name="fas fa-flag" size="md" />
    </q-item-section>

    <q-item-section avatar>
      <q-item-label class="text-weight-bold">Warning: Your {{ notification.target.type }} was flagged for not following our community guidelines.</q-item-label>
      <q-item-label caption>{{ notification.content }}</q-item-label>
    </q-item-section>

    <q-separator />
  </q-item>

  <q-item clickable v-ripple v-else-if="notification.type === 'follow'">
    <q-item-section avatar top right>
      <q-icon color="accent" name="fas fa-user" size="md" />
    </q-item-section>

    <q-item-section avatar>
      <q-avatar class="q-mb-sm">
        <img :src="notification.avatar">
      </q-avatar>
      <q-item-label><span class="text-weight-bold">{{ notification.user }}</span> followed you.</q-item-label>
    </q-item-section>

    <q-separator />
  </q-item>

  <q-separator />
</template>

<script>
export default {
  props: ['notification']
}
</script>