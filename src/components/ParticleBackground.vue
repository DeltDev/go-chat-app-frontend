<script setup>
const options = {
  background: {
    color: {
      value: "transparent", 
    },
  },
  fpsLimit: 120,
  particles: {
    color: {
      value: "#ffffff",
    },
    links: {
      color: "#ffffff",
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 3,
    },
    move: {
      direction: "none",
      enable: true,
      outModes: "bounce",
      random: false,
      speed: 1,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 800,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: "triangle",
    },
    size: {
      value: { min: 1, max: 10 },
    },
  },
  detectRetina: true,
};
</script>

<template>
  <div class="fixed inset-0 -z-10 h-full w-full bg-emerald-950">
    <vue-particles
      id="tsparticles"
      :options="options"
    />
  </div>
</template>