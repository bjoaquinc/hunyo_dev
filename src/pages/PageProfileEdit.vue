<template>
  <div class="q-pa-md">
    <q-form
      class="q-gutter-sm"
    >
      <div class="flex column flex-center">
        <q-btn round align="center">
          <q-avatar size="110px">
            <img src="https://cdn.quasar.dev/img/avatar2.jpg">
          </q-avatar>
        </q-btn>
        <q-btn
          color="secondary"
          label="Change Profile Photo"
          size="sm"
          class="q-mt-sm"
          dense
          flat
        />
      </div>
      
      <q-input
        dense
        filled
        label="Full name *"
        hint="Name and surname"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        dense
        filled
        label="School"
        hint="Latest academic achievement"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        dense
        filled
        label="Work"
        hint="Current employment or self employed"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        dense
        filled
        type="textarea"
        label="Bio"
        hint="Describe yourself"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        dense
        filled
        label="Location"
        hint="City, Country"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      <q-input
        dense
        filled
        label="Website"
        hint="Professional website or linkedin page"
        lazy-rules
        :rules="[ val => val && val.length > 0 || 'Please type something']"
      />

      
    </q-form>
  </div>
  
</template>