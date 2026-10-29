<script setup>
import { useUserStore } from '../stores/user';
import watchingMemeUrl from '../assets/i-am-watching-you.gif';

const userStore = useUserStore();
</script>

<template>
  <section class="about-page" aria-labelledby="about-title">
    <div class="about-hero">
      <div>
        <p class="about-hero__eyebrow">Лабораторная работа №7</p>
        <h1 id="about-title" class="about-hero__title">To‑Do, которое помнит, кто вы</h1>
        <p class="about-hero__lead">
          Приложение выросло из одной страницы в небольшой личный кабинет с маршрутами,
          Pinia и отдельным списком задач для каждого пользователя.
        </p>
        <RouterLink class="button button--primary" :to="userStore.isAuthenticated ? { name: 'tasks' } : { name: 'register' }">
          {{ userStore.isAuthenticated ? 'Перейти к задачам' : 'Создать аккаунт' }}
        </RouterLink>
      </div>
      <div class="about-hero__visual" aria-hidden="true">
        <span class="about-hero__check">✓</span>
        <span class="about-hero__orbit about-hero__orbit--one"></span>
        <span class="about-hero__orbit about-hero__orbit--two"></span>
      </div>
    </div>

    <div class="about-grid">
      <article class="about-card">
        <span class="about-card__number">01</span>
        <h2>Личные задачи</h2>
        <p>Каждая задача связана с устойчивым идентификатором пользователя. Чужие планы не попадают в ваш список.</p>
      </article>
      <article class="about-card">
        <span class="about-card__number">02</span>
        <h2>Состояние сохраняется</h2>
        <p>Pinia и persistedstate восстанавливают аккаунты, текущий вход и задачи после обновления страницы.</p>
      </article>
      <article class="about-card">
        <span class="about-card__number">03</span>
        <h2>Маршруты под контролем</h2>
        <p>Vue Router не пускает гостя в личный список и корректно работает по прямым ссылкам на статическом хостинге.</p>
      </article>
    </div>

    <figure class="about-meme">
      <img
        :src="watchingMemeUrl"
        alt="Мужчина внимательно следит за происходящим"
      >
      <figcaption>Когда список задач внимательно следит, всё ли ты выполнил.</figcaption>
    </figure>

    <aside class="about-warning" aria-labelledby="about-warning-title">
      <div class="about-warning__icon" aria-hidden="true">!</div>
      <div>
        <h2 id="about-warning-title">Важно знать</h2>
        <p>
          Здесь нет сервера, шифрования и настоящей защиты аккаунтов. Данные находятся в `localStorage`,
          поэтому для проверки подходят только вымышленные email и пароли.
        </p>
      </div>
    </aside>
  </section>
</template>
