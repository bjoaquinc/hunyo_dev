<template>
  <div style="height: 100%">
    <q-card
      class="full-width flex justify-between q-py-sm q-px-sm bg-grey-1"
      flat
      bordered
    >
      <q-btn
        color="secondary"
        icon="fas fa-times"
        dense
        flat
        :to="{ name: 'PageHome' }"
      />
      <div class="text-h6">Settings</div>
      <div style="width: 28px; height: 28px" />
    </q-card>
    <q-list bordered padding>
      <q-item-label header>Settings</q-item-label>

      <q-item clickable to="/settings/email" v-ripple>
        <q-item-section>
          <q-item-label>Email</q-item-label>
          <q-item-label caption> See your email. </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon size="xs" name="fas fa-chevron-right" />
        </q-item-section>
      </q-item>

      <q-item clickable to="/settings/password" v-ripple>
        <q-item-section>
          <q-item-label>Password</q-item-label>
          <q-item-label caption> Change your password. </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon size="xs" name="fas fa-chevron-right" />
        </q-item-section>
      </q-item>

      <q-separator spaced />
      <q-item-label header>Privacy</q-item-label>

      <q-item clickable to="/settings/terms" v-ripple>
        <q-item-section>
          <q-item-label>Terms of Use</q-item-label>
          <q-item-label caption> Review Hunyos Terms of Use. </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon size="xs" name="fas fa-chevron-right" />
        </q-item-section>
      </q-item>

      <q-item clickable to="/settings/privacy" v-ripple>
        <q-item-section>
          <q-item-label>Privacy Policy</q-item-label>
          <q-item-label caption> Review Hunyos Privacy Policy. </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-icon size="xs" name="fas fa-chevron-right" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  setup() {},
};
</script>
