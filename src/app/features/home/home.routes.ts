import { Routes } from "@angular/router";

export const HomeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../main-content/main-content.component').then(c => c.MainContentComponent),
    title: 'Advogado Trabalhista em Santos | Dr. Allan Rodrigues Advocacia',
    data: {
      metaDescription: 'Escritório de advocacia em Santos/SP especializado em Direito do Trabalho, Cível e Previdenciário. Mais de 8 anos de experiência e 500+ clientes. Agende sua consulta.'
    }
  },
  {
    path: 'sobre',
    loadComponent: () => import('../sobre/sobre.component').then(c => c.SobreComponent),
    title: 'Sobre o Dr. Allan Rodrigues | Advogado Especialista em Santos - SP',
    data: {
      metaDescription: 'Conheça a trajetória do Dr. Allan Rodrigues, advogado com mais de 8 anos de experiência, atendimento humanizado e foco em resultados para clientes em Santos e todo o Brasil.'
    }
  },
  {
    path: 'calculadora-trabalhista',
    loadComponent: () => import('../calculadora-trabalhista/calculadora-trabalhista.component').then(c => c.CalculadoraTrabalhistaComponent),
    title: 'Calculadora de Rescisão e Férias Gratuita | Allan Rodrigues Advocacia',
    data: {
      metaDescription: 'Simule grátis seus direitos trabalhistas! Calculadora online precisa de FGTS, Férias e Rescisão, desenvolvida e validada por advogados especialistas em Santos/SP.'
    }
  },
  {
    path: 'areas-de-atuacao',
    loadComponent: () => import('../areas-de-atuacao/areas-de-atuacao.component').then(c => c.AreasDeAtuacaoComponent),
    title: 'Áreas de Atuação | Advocacia Trabalhista, Cível e Previdenciária em Santos',
    data: {
      metaDescription: 'Conheça as áreas de atuação da Allan Rodrigues Advocacia: Direito do Trabalho, Civil, Previdenciário, Família e Consumidor. Soluções jurídicas personalizadas.'
    }
  },
  {
    path: 'contato',
    loadComponent: () => import('../contato/contato.component').then(c => c.ContatoComponent),
    title: 'Fale Conosco | Allan Rodrigues Advocacia em Santos - SP',
    data: {
      metaDescription: 'Entre em contato com a Allan Rodrigues Advocacia. Atendimento presencial em Santos e online para todo o Brasil via WhatsApp, telefone ou e-mail.'
    }
  }
];