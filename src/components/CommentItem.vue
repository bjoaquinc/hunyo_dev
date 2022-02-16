<template>
  <q-card flat>
    <q-item>
      <q-item-section avatar>
        <q-avatar size="30px">
          <img src="https://cdn.quasar.dev/img/avatar2.jpg">
        </q-avatar>
      </q-item-section>

      <q-space />

      <q-item-section>
        <q-item-label lines="1" class="comment-user">Fatima Arkin • <span class="text-weight-light">16h</span></q-item-label>
      </q-item-section>
    </q-item>
    <q-card-section>
      Lorem ipsum dolor sit amet consectetur, adipisicing elit. Soluta iusto cum, architecto aliquid optio excepturi ad deserunt laborum fugiat sed repellendus nobis quaerat ipsa? Repudiandae neque nobis nulla ea modi!
    </q-card-section>
    <q-card-actions>
        <q-btn flat size="sm" dense color="primary" icon="far fa-smile" label="Helpful" />
        <q-btn flat size="sm" dense color="primary" icon="fas fa-reply" label="Reply" />
        <q-btn flat size="sm" dense color="primary" icon="fas fa-flag" label="Flag" />
      </q-card-actions>
  </q-card>
  
  
</template>

<style lang="sass" scoped>
.q-item__section
  padding-right: 0
  min-width: 37px
.comment-user
  font-size: 13px
  font-weight: bold

.q-card__section
  padding: 0 16px  
  
</style>