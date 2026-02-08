<template>
  <div class="grid w-screen h-screen bg-linear-to-b from-[#4E4E96] to-black justify-center">
    <div class="pt-20 justify-center items-center flex">
      <img src="/logo.png" class="w-43 h-43" alt="">
    </div>
    <div class="bg-[#40417D]/50 rounded-2xl h-max w-full p-4 grid">
      <div class="">
        <span class="rb-semibold text-white text-3xl">LunaVPN <div v-if="user">
      {{ user.id }}
   </div>
   <div v-else>
      Загрузка...
   </div></span>
      </div>
      <div class="flex gap-9 pt-5 justify-between">
        <div class="grid"><span class="text-white rb-regular text-2xl">250₽</span><span class="text-white/50 rb-light" style="font-size: 12px;">Ваш баланс</span></div>
        <div class="grid"><span class="text-white rb-regular text-2xl">до 22 января 2025</span><span class="text-white/50 text-right rb-light" style="font-size: 12px;">Активна</span></div>
      </div>
      <div class="grid mt-5">
          <button class="mt-2 w-full bg-[#6D8AFF]/20 border border-[#6D8AFF] rb-light text-white py-3 rounded-2xl">Пополнить баланс</button>
          <button class="mt-2 w-full bg-[#6D8AFF]/20 border border-[#6D8AFF] rb-light text-white py-3 rounded-2xl">Скачать приложение</button>
          <div class="flex gap-3">
            <button class="mt-2 w-full bg-[#6D8AFF]/20 border border-[#6D8AFF] rb-light text-white py-3 rounded-2xl">Профиль</button>
            <button class="mt-2 w-full bg-[#6D8AFF]/20 border border-[#6D8AFF] rb-light text-white py-3 rounded-2xl">Помощь</button>
          </div>
      </div>
    </div>
  </div>
  <AppFooter />
</template>
