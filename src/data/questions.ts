/**
 * Banco de dados de questões para o Game de Estudo P2
 * Contém mais de 150 questões divididas por matérias.
 */

export interface Question {
  id: number;
  type: 'choice' | 'dictation';
  question: string;
  options?: string[];
  correct: string;
  explanation: string;
  difficulty: 'Fácil' | 'Moderado' | 'Difícil';
}

export interface Subject {
  title: string;
  id: string;
  icon: string;
  color: string;
  modules: Record<string, Module>;
}

export interface Module {
  id?: number;
  subjectId?: string;
  moduleKey?: string;
  title: string;
  description: string;
  studyContent?: string;
  videoUrl?: string;
  period?: string;
  questions: Question[];
}

export const questionDatabase: Record<string, Subject> = {
  "portugues": {
    "title": "Português",
    "id": "portugues",
    "icon": "📝",
    "color": "orange",
    "modules": {
      "verbos": {
        "title": "Verbos (Infinitivo, Pronomes e Ligação)",
        "description": "Reconhecer o infinitivo, usar pronomes (Eu, Tu, Ele...) e identificar verbos de ligação.",
        "studyContent": "**O que são Verbos?**\nVerbos são palavras que indicam **ação** (correr, pular), **estado** (ser, estar) ou **fenômeno da natureza** (chover, trovejar).\n\n**1. O Infinitivo (O nome do verbo)**\nÉ como o verbo \"nasce\". Termina sempre em **-AR**, **-ER** ou **-IR**.\n* Exemplos: Cant**ar**, Com**er**, Sorr**ir**.\n\n**2. Os Pronomes Pessoais (As pessoas da frase)**\nPara saber quem faz a ação, usamos os pronomes:\n* **Singular:** Eu, Tu, Ele / Ela.\n* **Plural:** Nós, Vós, Eles / Elas.\n\n**3. Verbos de Ligação (O \"Estado\")**\nAlguns verbos não indicam movimento, mas sim como alguém **é** ou **está**. Eles ligam o sujeito a uma qualidade.\n* Principais: **Ser, Estar, Parecer, Ficar, Continuar, Tornar-se.**\n* Exemplo: \"A flor **é** cheirosa.\" (O verbo *é* liga a flor ao fato de ser cheirosa).\n\n**Dica:** O verbo \"muda de roupa\" (conjugação) para combinar com a pessoa!",
        "questions": [
          {
            "id": 62593,
            "type": "choice",
            "question": "Qual destes indica uma AÇÃO?",
            "options": [
              "Pular",
              "Cadeira",
              "Bonito"
            ],
            "correct": "Pular",
            "explanation": "Pular é um movimento, uma ação.",
            "difficulty": "Fácil"
          },
          {
            "id": 62594,
            "type": "choice",
            "question": "O \"nome\" do verbo no dicionário chama-se:",
            "options": [
              "Conjugação",
              "Infinitivo",
              "Pontuação"
            ],
            "correct": "Infinitivo",
            "explanation": "O infinitivo é o verbo sem estar conjugado (ex: falar, comer).",
            "difficulty": "Fácil"
          },
          {
            "id": 62595,
            "type": "choice",
            "question": "Os pronomes do PLURAL são:",
            "options": [
              "Eu, Tu, Ele",
              "Nós, Vós, Eles",
              "Mim, Te, Se"
            ],
            "correct": "Nós, Vós, Eles",
            "explanation": "Indicam mais de uma pessoa.",
            "difficulty": "Fácil"
          },
          {
            "id": 62596,
            "type": "choice",
            "question": "Substitua \"Maria e eu\" por um pronome:",
            "options": [
              "Eles",
              "Nós",
              "Vós"
            ],
            "correct": "Nós",
            "explanation": "Eu + outra pessoa = Nós.",
            "difficulty": "Fácil"
          },
          {
            "id": 62597,
            "type": "choice",
            "question": "Qual destes é o pronome da 2ª pessoa do singular?",
            "options": [
              "Eu",
              "Tu",
              "Vós"
            ],
            "correct": "Tu",
            "explanation": "Tu é a pessoa com quem se fala diretamente.",
            "difficulty": "Fácil"
          },
          {
            "id": 62598,
            "type": "choice",
            "question": "Complete: \"___ (1ª pessoa plural) vamos ao parque.\"",
            "options": [
              "Eu",
              "Eles",
              "Nós"
            ],
            "correct": "Nós",
            "explanation": "Nós indica a 1ª pessoa do plural.",
            "difficulty": "Fácil"
          },
          {
            "id": 62599,
            "type": "choice",
            "question": "O verbo \"ESTAR\" em \"Eu estou bem\" indica:",
            "options": [
              "Que eu fiz algo",
              "Como eu me sinto (um estado)",
              "Um barulho"
            ],
            "correct": "Como eu me sinto (um estado)",
            "explanation": "Verbo de ligação indica estado.",
            "difficulty": "Fácil"
          },
          {
            "id": 62600,
            "type": "choice",
            "question": "Qual a 3ª pessoa do singular?",
            "options": [
              "Tu",
              "Nós",
              "Ele ou Ela"
            ],
            "correct": "Ele ou Ela",
            "explanation": "A pessoa de quem se fala.",
            "difficulty": "Fácil"
          },
          {
            "id": 62601,
            "type": "choice",
            "question": "Substitua \"Os meninos\" por um pronome:",
            "options": [
              "Vós",
              "Eles",
              "Nós"
            ],
            "correct": "Eles",
            "explanation": "Eles substitui pessoas no masculino plural.",
            "difficulty": "Fácil"
          },
          {
            "id": 62602,
            "type": "choice",
            "question": "Qual verbo indica um FENÔMENO DA NATUREZA?",
            "options": [
              "Neva",
              "Gosta",
              "Fica"
            ],
            "correct": "Neva",
            "explanation": "Nevar é um fenômeno do clima.",
            "difficulty": "Fácil"
          },
          {
            "id": 62603,
            "type": "choice",
            "question": "Qual frase usa o pronome EU corretamente?",
            "options": [
              "Eu correu.",
              "Eu corro.",
              "Eu corremos."
            ],
            "correct": "Eu corro.",
            "explanation": "O verbo combina com o pronome Eu.",
            "difficulty": "Fácil"
          },
          {
            "id": 62604,
            "type": "choice",
            "question": "Qual o infinitivo de \"CANTAMOS\"?",
            "options": [
              "Cantamos",
              "Cantar",
              "Cancioneiro"
            ],
            "correct": "Cantar",
            "explanation": "Infinitivo termina em -ar.",
            "difficulty": "Fácil"
          },
          {
            "id": 62693,
            "type": "choice",
            "question": "Qual frase possui um VERBO DE LIGAÇÃO?",
            "options": [
              "O sol brilha.",
              "A menina corre.",
              "O dia está lindo."
            ],
            "correct": "O dia está lindo.",
            "explanation": "\"Está\" indica um estado, ligando o dia à sua qualidade.",
            "difficulty": "Moderado"
          },
          {
            "id": 62694,
            "type": "choice",
            "question": "\"Parecer\" e \"Continuar\" são verbos de:",
            "options": [
              "Ação",
              "Ligação (Estado)",
              "Fenômeno"
            ],
            "correct": "Ligação (Estado)",
            "explanation": "Indicam como algo se apresenta ou permanece.",
            "difficulty": "Moderado"
          },
          {
            "id": 62695,
            "type": "choice",
            "question": "Qual o infinitivo de \"NÓS SOMOS\"?",
            "options": [
              "Sermos",
              "Ser",
              "Somar"
            ],
            "correct": "Ser",
            "explanation": "Ser é o infinitivo irregular de somos.",
            "difficulty": "Moderado"
          },
          {
            "id": 62696,
            "type": "choice",
            "question": "Identifique o pronome: \"___ estudas muito.\"",
            "options": [
              "Tu",
              "Ele",
              "Eu"
            ],
            "correct": "Tu",
            "explanation": "A terminação -as combina com Tu.",
            "difficulty": "Moderado"
          },
          {
            "id": 62697,
            "type": "choice",
            "question": "Marque a opção com apenas verbos de LIGAÇÃO:",
            "options": [
              "Correr, pular, cair",
              "Ser, estar, parecer",
              "Falar, gritar, ouvir"
            ],
            "correct": "Ser, estar, parecer",
            "explanation": "Esses verbos indicam estado.",
            "difficulty": "Moderado"
          },
          {
            "id": 62698,
            "type": "choice",
            "question": "O pronome \"VÓS\" refere-se a:",
            "options": [
              "Eu sozinho",
              "As pessoas com quem falo",
              "As pessoas de quem falo"
            ],
            "correct": "As pessoas com quem falo",
            "explanation": "Vós é a 2ª pessoa do plural.",
            "difficulty": "Moderado"
          },
          {
            "id": 62699,
            "type": "choice",
            "question": "Qual o infinitivo do verbo na frase \"Ela parecia cansada\"?",
            "options": [
              "Parecer",
              "Cansar",
              "Parentada"
            ],
            "correct": "Parecer",
            "explanation": "Parecer é o nome do verbo original.",
            "difficulty": "Moderado"
          },
          {
            "id": 62700,
            "type": "choice",
            "question": "No grupo \"Eu, Tu, Ele\", todos estão no:",
            "options": [
              "Singular",
              "Plural"
            ],
            "correct": "Singular",
            "explanation": "Referem-se a apenas uma person.",
            "difficulty": "Moderado"
          },
          {
            "id": 62701,
            "type": "choice",
            "question": "O pronome \"ELES\" indica a:",
            "options": [
              "1ª pessoa do plural",
              "2ª pessoa do plural",
              "3ª pessoa do plural"
            ],
            "correct": "3ª pessoa do plural",
            "explanation": "Pessoas de quem se fala (plural).",
            "difficulty": "Moderado"
          },
          {
            "id": 62702,
            "type": "choice",
            "question": "Qual frase tem um verbo de AÇÃO?",
            "options": [
              "O menino está feliz.",
              "O menino correu muito.",
              "O menino parece cansado."
            ],
            "correct": "O menino correu muito.",
            "explanation": "Correr é uma ação física.",
            "difficulty": "Moderado"
          },
          {
            "id": 62703,
            "type": "choice",
            "question": "Os verbos que indicam sentimentos geralmente são de:",
            "options": [
              "Ação",
              "Estado (Ligação)",
              "Fenômeno"
            ],
            "correct": "Estado (Ligação)",
            "explanation": "Ex: \"Ele está triste\".",
            "difficulty": "Moderado"
          },
          {
            "id": 62793,
            "type": "choice",
            "question": "Complete: \"Nós ___ (ficar) em casa hoje.\"",
            "options": [
              "fica",
              "ficamos",
              "fiquei"
            ],
            "correct": "ficamos",
            "explanation": "Ficamos combina with Nós.",
            "difficulty": "Difícil"
          },
          {
            "id": 62794,
            "type": "choice",
            "question": "Qual o infinitivo do verbo \"ESTIVEMOS\"?",
            "options": [
              "Estivar",
              "Estar",
              "Estivermos"
            ],
            "correct": "Estar",
            "explanation": "Conjugação do verbo Estar.",
            "difficulty": "Difícil"
          },
          {
            "id": 62795,
            "type": "choice",
            "question": "O pronome \"VÓS\" é da qual pessoa?",
            "options": [
              "2ª pessoa do plural",
              "3ª pessoa do plural",
              "2ª pessoa do singular"
            ],
            "correct": "2ª pessoa do plural",
            "explanation": "Plural de Tu.",
            "difficulty": "Difícil"
          },
          {
            "type": "choice",
            "question": "O verbo 'VENTAR' indica qual categoria?",
            "options": [
              "Estado",
              "Fenômeno da natureza",
              "Ação"
            ],
            "correct": "Fenômeno da natureza",
            "explanation": "Ventar é um acontecimento natural.",
            "difficulty": "Fácil",
            "id": 960852
          },
          {
            "type": "choice",
            "question": "Qual pronome substitui corretamente o sujeito em 'O cachorro e o gato brincam'?",
            "options": [
              "Nós",
              "Eles",
              "Vós"
            ],
            "correct": "Eles",
            "explanation": "Dois ou mais animais/coisas equivalem a 'Eles'.",
            "difficulty": "Moderado",
            "id": 960853
          },
          {
            "type": "choice",
            "question": "Qual é o infinito e o pronome da frase 'Saímos apressados'?",
            "options": [
              "Sair - Nós",
              "Sairmos - Vós",
              "Sair - Eles"
            ],
            "correct": "Sair - Nós",
            "explanation": "O verbo original é Sair, e a desinência -mos indica o pronome oculto Nós.",
            "difficulty": "Difícil",
            "id": 960854
          },
          {
            "type": "choice",
            "question": "O verbo 'PERTENCER' indica:",
            "options": [
              "Estado",
              "Ação",
              "Fenômeno da natureza"
            ],
            "correct": "Estado",
            "explanation": "Indica uma relação de posse ou estado permanente.",
            "difficulty": "Moderado",
            "id": 960894
          },
          {
            "type": "choice",
            "question": "Selecione o pronome correto: ___ fostes ao cinema?",
            "options": [
              "Nós",
              "Vós",
              "Eu"
            ],
            "correct": "Vós",
            "explanation": "Fostes é a segunda pessoa do plural (vós).",
            "difficulty": "Fácil",
            "id": 960895
          },
          {
            "type": "choice",
            "question": "Um verbo transitivo precisa do quê para fazer sentido?",
            "options": [
              "De um artigo",
              "De um complemento (objeto)",
              "De um pronome"
            ],
            "correct": "De um complemento (objeto)",
            "explanation": "O transitivo não faz sentido sozinho, ele transita.",
            "difficulty": "Difícil",
            "id": 960896
          }
        ]
      },
      "sc_sc": {
        "title": "Uso de SC ou SÇ",
        "description": "Diferença entre o dígrafo SC (antes de E, I) e SÇ (antes de A, O, U).",
        "studyContent": "**SC ou SÇ? Vamos aprender!**\nÀs vezes, duas letras juntas fazem um único som de **S**. Chamamos isso de dígrafo!\n\n**Quando usar SC?**\nUsamos o **SC** antes das vogais **E** e **I**.\n* Exemplos: Na**sc**er, Cre**sc**er, De**sc**er, Pi**sc**ina, Di**sc**iplina.\n* Dica: Se o som de S vem antes de E ou I, a chance de ser SC é bem grande!\n\n**Quando usar SÇ?**\nUsamos o **SÇ** antes das vogais **A, O, U**.\nGeralmente isso acontece quando o verbo já tem SC no infinitivo e a gente precisa mudar para combinar com A, O ou U sem perder o som de S.\n* Exemplos: Na**sç**a (de nascer), Cre**sç**o (de crescer), De**sç**a (de descer).\n\n**Regra de Ouro:** Nunca começamos nenhuma palavra com SÇ ou SC com som de S!",
        "questions": [
          {
            "id": 407833,
            "type": "choice",
            "question": "Qual a escrita correta?",
            "options": [
              "Nascimentu",
              "Nascimento",
              "Nacimento"
            ],
            "correct": "Nascimento",
            "explanation": "Nascimento se escreve com SC.",
            "difficulty": "Fácil"
          },
          {
            "id": 407834,
            "type": "choice",
            "question": "A palavra \"CRESCER\" pertence ao grupo do dígrafo:",
            "options": [
              "SC",
              "SS",
              "SÇ"
            ],
            "correct": "SC",
            "explanation": "Crescer se escreve com SC pois o C vem antes de E.",
            "difficulty": "Fácil"
          },
          {
            "id": 407835,
            "type": "choice",
            "question": "Qual destas palavras deve ser escrita com SC?",
            "options": [
              "Disiplina",
              "Disciplina",
              "Dissiplina"
            ],
            "correct": "Disciplina",
            "explanation": "Disciplina se escreve com SC.",
            "difficulty": "Fácil"
          },
          {
            "id": 407836,
            "type": "choice",
            "question": "A palavra \"PISCINA\" se escreve com:",
            "options": [
              "SS",
              "SC",
              "SÇ"
            ],
            "correct": "SC",
            "explanation": "Piscina é escrita com SC.",
            "difficulty": "Fácil"
          },
          {
            "id": 407837,
            "type": "choice",
            "question": "Usamos SÇ antes de quais vogais?",
            "options": [
              "A, O, U",
              "E, I",
              "A, E, I"
            ],
            "correct": "A, O, U",
            "explanation": "Para manter o som de S onde o C sozinho teria som de K.",
            "difficulty": "Fácil"
          },
          {
            "id": 407838,
            "type": "choice",
            "question": "Usamos SC (dígrafo) antes de quais vogais?",
            "options": [
              "A, O, U",
              "E, I",
              "Todas"
            ],
            "correct": "E, I",
            "explanation": "SC tem som de S antes de E e I.",
            "difficulty": "Fácil"
          },
          {
            "id": 407839,
            "type": "choice",
            "question": "A palavra \"EXCEÇÃO\" foge à regra, mas \"NASCER\" usa:",
            "options": [
              "SS",
              "SC",
              "SÇ"
            ],
            "correct": "SC",
            "explanation": "Nascer usa SC.",
            "difficulty": "Fácil"
          },
          {
            "id": 407933,
            "type": "choice",
            "question": "Como se escreve: \"Que tu ___ (nascer) feliz\"?",
            "options": [
              "nasça",
              "nasca",
              "nascça"
            ],
            "correct": "nasça",
            "explanation": "Usamos SÇ antes de A para manter o som de S (Nascer -> Nasça).",
            "difficulty": "Moderado"
          },
          {
            "id": 407934,
            "type": "choice",
            "question": "Complete a frase: \"Por favor, ___ (descer) devagar.\"",
            "options": [
              "desça",
              "desca",
              "dessça"
            ],
            "correct": "desça",
            "explanation": "Descer (SC) vira Desça (SÇ) antes de A.",
            "difficulty": "Moderado"
          },
          {
            "id": 407935,
            "type": "choice",
            "question": "Qual o infinitivo de \"EU CRESÇO\"?",
            "options": [
              "Crescer",
              "Crecer",
              "Cressão"
            ],
            "correct": "Crescer",
            "explanation": "Crescer se escreve com SC.",
            "difficulty": "Moderado"
          },
          {
            "id": 407936,
            "type": "choice",
            "question": "Como se escreve: \"Ele tem muita ___ (consciência)\"?",
            "options": [
              "consiência",
              "consciência",
              "conciência"
            ],
            "correct": "consciência",
            "explanation": "Consciência se escreve com SC.",
            "difficulty": "Moderado"
          },
          {
            "id": 407937,
            "type": "choice",
            "question": "\"Desejo que a planta ___ (florescer)\".",
            "options": [
              "floresca",
              "floresça",
              "floressa"
            ],
            "correct": "floresça",
            "explanation": "SÇ antes de A.",
            "difficulty": "Moderado"
          },
          {
            "id": 408033,
            "type": "choice",
            "question": "Complete: \"Eu ___ (descer) as escadas todos os dias.\"",
            "options": [
              "desço",
              "deço",
              "dessço"
            ],
            "correct": "desço",
            "explanation": "SÇ antes de O.",
            "difficulty": "Difícil"
          },
          {
            "type": "choice",
            "question": "Qual a forma correta da palavra?",
            "options": [
              "Naicer",
              "Nascer",
              "Nasser"
            ],
            "correct": "Nascer",
            "explanation": "A palavra nascer escreve-se com SC.",
            "difficulty": "Fácil",
            "id": 960855
          },
          {
            "type": "choice",
            "question": "Complete: De_a (do verbo Descer)",
            "options": [
              "sç",
              "sc",
              "ss"
            ],
            "correct": "sç",
            "explanation": "Quando a vogal seguinte é 'a' ou 'o', o sc vira sç para manter o som (desça).",
            "difficulty": "Moderado",
            "id": 960856
          },
          {
            "type": "choice",
            "question": "Qual destas palavras está escrita de forma incorreta?",
            "options": [
              "Piscina",
              "Crescimento",
              "Nasçente"
            ],
            "correct": "Nasçente",
            "explanation": "O correto é Nascente. Não se usa cedilha antes de e ou i.",
            "difficulty": "Difícil",
            "id": 960857
          },
          {
            "type": "choice",
            "question": "Qual a maneira certa de escrever a palavra?",
            "options": [
              "Florecer",
              "Florescer",
              "Floreçer"
            ],
            "correct": "Florescer",
            "explanation": "Usamos SC.",
            "difficulty": "Fácil",
            "id": 960897
          },
          {
            "type": "choice",
            "question": "Complete a palavra: A_ão. (Ação)",
            "options": [
              "ssc",
              "sç",
              "ç"
            ],
            "correct": "ç",
            "explanation": "Ação não possui S, apenas cê-cedilha.",
            "difficulty": "Moderado",
            "id": 960898
          },
          {
            "type": "choice",
            "question": "A palavra 'Cres_a' requer quais letras?",
            "options": [
              "Sç",
              "ç",
              "Sc"
            ],
            "correct": "Sç",
            "explanation": "De Crescer, usa-se sç antes de A.",
            "difficulty": "Difícil",
            "id": 960899
          }
        ]
      },
      "discursos": {
        "title": "Discurso Direto e Indireto",
        "description": "Diferença entre a fala direta do personagem e a narração da fala.",
        "studyContent": "**Quem está falando? vamos descobrir!**\nExistem duas formas de contar o que alguém disse em uma história.\n\n**1. Discurso Direto (A fala viva!)**\nÉ quando o personagem fala diretamente. Usamos sinais para avisar que ele vai falar.\n* **Sinais:** Dois-pontos (:), Travessão (—) ou Aspas (\" \").\n* Exemplo: João disse: **— Estou com muita fome!**\n* Note que lemos as palavras exatinhas que o João usou.\n\n**2. Discurso Indireto (O narrador conta)**\nÉ quando o narrador usa as suas próprias palavras para dizer o que o personagem falou.\n* **Sinais:** Não usa travessão nem aspas para a fala. Geralmente usa a palavra \"que\".\n* Exemplo: João disse **que** estava com muita fome.\n* Note que é como se alguém estivesse fazendo uma fofoca do que o João disse!",
        "questions": [
          {
            "id": 506505,
            "type": "choice",
            "question": "No discurso direto, quem fala é:",
            "options": [
              "O narrador",
              "O próprio personagem",
              "O autor do livro"
            ],
            "correct": "O próprio personagem",
            "explanation": "O discurso direto apresenta a fala exata do personagem.",
            "difficulty": "Fácil"
          },
          {
            "id": 506506,
            "type": "choice",
            "question": "Qual sinal de pontuação costuma introduzir a fala no discurso direto?",
            "options": [
              "Ponto Final",
              "Travessão ou Aspas",
              "Ponto de Interrogação"
            ],
            "correct": "Travessão ou Aspas",
            "explanation": "O travessão indica o início da fala do personagem.",
            "difficulty": "Fácil"
          },
          {
            "id": 506605,
            "type": "choice",
            "question": "No discurso indireto, quem conta o que o personagem disse é:",
            "options": [
              "O próprio personagem",
              "O narrador",
              "Ninguém"
            ],
            "correct": "O narrador",
            "explanation": "O narrador usa suas próprias palavras para dizer o que o personagem falou.",
            "difficulty": "Moderado"
          },
          {
            "id": 506606,
            "type": "choice",
            "question": "Qual frase está no DISCURSO DIRETO?",
            "options": [
              "Ele disse que estava com fome.",
              "— Estou com fome — disse ele.",
              "O menino sentiu fome."
            ],
            "correct": "— Estou com fome — disse ele.",
            "explanation": "O uso do travessão e a fala na 1ª pessoa indicam discurso direto.",
            "difficulty": "Moderado"
          },
          {
            "id": 506607,
            "type": "choice",
            "question": "Qual frase está no DISCURSO INDIRETO?",
            "options": [
              "Maria gritou: — Socorro!",
              "Maria gritou pedindo socorro.",
              "— Socorro! — gritou Maria."
            ],
            "correct": "Maria gritou pedindo socorro.",
            "explanation": "O narrador conta a ação de Maria sem reproduzir a fala exata.",
            "difficulty": "Moderado"
          },
          {
            "id": 506608,
            "type": "choice",
            "question": "O travessão é proibido no discurso indireto?",
            "options": [
              "Sim",
              "Não",
              "Às vezes"
            ],
            "correct": "Sim",
            "explanation": "O travessão marca a fala direta.",
            "difficulty": "Moderado"
          },
          {
            "id": 506705,
            "type": "choice",
            "question": "Verbos de elocução (disse, falou) são obrigatórios no indireto?",
            "options": [
              "Sim",
              "Não (mas ajudam)",
              "Sempre vêm depois"
            ],
            "correct": "Não (mas ajudam)",
            "explanation": "O importante é o narrador relatar a fala.",
            "difficulty": "Difícil"
          },
          {
            "type": "choice",
            "question": "O travessão (—) costuma aparecer em qual tipo de discurso?",
            "options": [
              "Direto",
              "Indireto"
            ],
            "correct": "Direto",
            "explanation": "O travessão indica a fala exata do personagem.",
            "difficulty": "Fácil",
            "id": 960858
          },
          {
            "type": "choice",
            "question": "Passe para o indireto: 'Eu gosto de bolo.', disse João.",
            "options": [
              "João disse: Eu gosto de bolo.",
              "João disse que gostava de bolo.",
              "João falará de bolo."
            ],
            "correct": "João disse que gostava de bolo.",
            "explanation": "O narrador relata a fala com suas próprias palavras.",
            "difficulty": "Moderado",
            "id": 960859
          },
          {
            "type": "choice",
            "question": "Qual frase é o discurso direto da seguinte afirmação: 'A professora pediu para abrirmos os livros.'?",
            "options": [
              "A professora disse: — Abram os livros.",
              "A professora falou que devíamos abrir os livros.",
              "Abram os livros, disse a professora."
            ],
            "correct": "A professora disse: — Abram os livros.",
            "explanation": "Usa dois pontos e a fala exata ou aspas.",
            "difficulty": "Difícil",
            "id": 960860
          },
          {
            "type": "choice",
            "question": "No discurso indireto livre, as falas do narrador e do personagem:",
            "options": [
              "Ficam misturadas e sem marcações claras",
              "Usam sempre dois pontos",
              "São sempre entre aspas"
            ],
            "correct": "Ficam misturadas e sem marcações claras",
            "explanation": "Misturam as duas vozes sem aviso.",
            "difficulty": "Difícil",
            "id": 960900
          },
          {
            "type": "choice",
            "question": "Marque a frase do discurso direto.",
            "options": [
              "O rei declarou que seria rei para sempre.",
              "O rei bradou: — Sou rei para sempre!",
              "O rei quis ser rei."
            ],
            "correct": "O rei bradou: — Sou rei para sempre!",
            "explanation": "Tem marcação de fala em tempo real.",
            "difficulty": "Fácil",
            "id": 960901
          },
          {
            "type": "choice",
            "question": "Qual pronome sofre alteração ao passar de discurso direto ('Eu vi') para indireto?",
            "options": [
              "Ele",
              "Ela",
              "Nós / Eles"
            ],
            "correct": "Ele",
            "explanation": "Exemplo: Ele disse que ELE viu.",
            "difficulty": "Moderado",
            "id": 960902
          }
        ]
      },
      "acentos": {
        "title": "Acento Agudo e Circunflexo",
        "description": "Uso do acento agudo (´) para som aberto e circunflexo (^) para som fechado.",
        "studyContent": "**Os Chapéus das Palavras!**\nOs acentos servem para mostrar qual é a parte mais forte da palavra e como devemos abrir a boca para falar.\n\n**1. Acento Agudo (´) - Som Aberto**\nImagine que o som quer \"escapar\" da boca! É um som alegre e aberto.\n* Exemplos: Caf**é**, Cip**ó**, **Á**rvore, Picol**é**, Vov**ó**.\n* Apelido carinhoso: \"O grampo da vovó\".\n\n**2. Acento Circunflexo (^) - Som Fechado**\nO som fica mais \"presinho\", guardado dentro da boca.\n* Exemplos: Voc**ê**, Vov**ô**, Ônibus, Rob**ô**, Tr**ê**s.\n* Apelido carinhoso: \"O chapeuzinho do vovô\".\n\n**Dica:** Repare na diferença entre Vov**ó** (aberto!) e Vov**ô** (fechado!).",
        "questions": [
          {
            "id": 564410,
            "type": "choice",
            "question": "Qual acento indica o som ABERTO?",
            "options": [
              "Agudo (´)",
              "Circunflexo (^)",
              "Til (~)"
            ],
            "correct": "Agudo (´)",
            "explanation": "O acento agudo torna a pronúncia da vogal aberta (Ex: Café, Cipó).",
            "difficulty": "Fácil"
          },
          {
            "id": 564411,
            "type": "choice",
            "question": "Qual acento indica o som FECHADO?",
            "options": [
              "Agudo (´)",
              "Circunflexo (^)",
              "Crase (`)"
            ],
            "correct": "Circunflexo (^)",
            "explanation": "O circunflexo torna a pronúncia fechada (Ex: Vovô, Robô).",
            "difficulty": "Fácil"
          },
          {
            "id": 564412,
            "type": "choice",
            "question": "A palavra \"CAFÉ\" leva qual acento?",
            "options": [
              "Agudo",
              "Circunflexo",
              "Nenhum"
            ],
            "correct": "Agudo",
            "explanation": "Ca-fé (som aberto).",
            "difficulty": "Fácil"
          },
          {
            "id": 564413,
            "type": "choice",
            "question": "Como se escreve corretamente \"VOV_\"? (Vovô - masculino)",
            "options": [
              "Vovó",
              "Vovô",
              "Vovo"
            ],
            "correct": "Vovô",
            "explanation": "O circunflexo indica o som fechado masculino.",
            "difficulty": "Fácil"
          },
          {
            "id": 564510,
            "type": "choice",
            "question": "Qual palavra recebe acento AGUDO?",
            "options": [
              "Estomago",
              "Arvore",
              "Onibus"
            ],
            "correct": "Arvore",
            "explanation": "Árvore (som aberto no Á).",
            "difficulty": "Moderado"
          },
          {
            "type": "choice",
            "question": "Qual acento tem som ABERTO?",
            "options": [
              "Agudo (´)",
              "Circunflexo (^)"
            ],
            "correct": "Agudo (´)",
            "explanation": "O acento agudo marca uma vogal com som aberto.",
            "difficulty": "Fácil",
            "id": 960861
          },
          {
            "type": "choice",
            "question": "Selecione a palavra com o acento correto:",
            "options": [
              "Pêssego",
              "Péssego",
              "Pessegô"
            ],
            "correct": "Pêssego",
            "explanation": "O som do 'e' é fechado, logo usamos o acento circunflexo.",
            "difficulty": "Moderado",
            "id": 960862
          },
          {
            "type": "choice",
            "question": "O significado das palavras 'Vovó' e 'Vovô' muda devido ao:",
            "options": [
              "Contexto",
              "Acento agudo e circunflexo",
              "Masculino e feminino"
            ],
            "correct": "Acento agudo e circunflexo",
            "explanation": "O acento marca de forma sonora a diferença das palavras.",
            "difficulty": "Difícil",
            "id": 960863
          },
          {
            "type": "choice",
            "question": "A palavra 'Lâmpada' usa qual acento?",
            "options": [
              "Agudo",
              "Circunflexo"
            ],
            "correct": "Circunflexo",
            "explanation": "Som fechado.",
            "difficulty": "Fácil",
            "id": 960903
          },
          {
            "type": "choice",
            "question": "Por que 'Júri' é acentuada?",
            "options": [
              "Porque termina em u",
              "Por ser paroxítona terminada em i",
              "É sempre acentuado"
            ],
            "correct": "Por ser paroxítona terminada em i",
            "explanation": "Regra clássica paroxítonas.",
            "difficulty": "Difícil",
            "id": 960904
          },
          {
            "type": "choice",
            "question": "A palavra 'Café' possui acento agudo porque é:",
            "options": [
              "Paroxítona em 'e'",
              "Oxítona terminada em 'e'",
              "Proparoxítona"
            ],
            "correct": "Oxítona terminada em 'e'",
            "explanation": "Última sílaba forte.",
            "difficulty": "Moderado",
            "id": 960905
          }
        ]
      },
      "mas_mais": {
        "title": "Mas vs Mais",
        "description": "Mas: Indica oposição (porém). Mais: Indica quantidade ou intensidade (+).",
        "studyContent": "**Mas ou Mais? Não erre mais!**\nEssas duas palavras parecem iguais, mas têm sentidos bem diferentes.\n\n**1. MAIS (com I de Intenso ou Adição)**\nUsamos quando queremos somar, adicionar ou mostrar que algo é maior ou mais intenso. É o contrário de \"menos\".\n* Exemplo: Eu quero **mais** um pedaço de bolo! (+)\n* Exemplo: Ele é o menino **mais** alto da sala.\n\n**2. MAS (sem I - Quer dizer \"Porém\")**\nUsamos quando queremos dizer uma ideia contrária. Algo aconteceu, \"mas\" outra coisa impediu ou mudou.\n* Exemplo: Eu queria brincar, **mas** começou a chover.\n* Dica: Se você conseguir trocar por \"porém\", use **MAS**.\n\n**Resumo:** MAIS = Soma (+) | MAS = Porém.",
        "questions": [
          {
            "id": 571562,
            "type": "choice",
            "difficulty": "Fácil",
            "question": "Qual a forma correta: \"Eu queria brincar, ___ tenho que estudar.\"",
            "options": [
              "mais",
              "mas",
              "más"
            ],
            "correct": "mas",
            "explanation": "\"Mas\" indica oposição (porém). \"Mais\" indica quantidade."
          },
          {
            "id": 571563,
            "type": "choice",
            "difficulty": "Fácil",
            "question": "Complete: \"Ele é o aluno ___ inteligente da turma.\"",
            "options": [
              "mais",
              "mas",
              "más"
            ],
            "correct": "mais",
            "explanation": "\"Mais\" é usado para intensidade ou quantidade."
          },
          {
            "id": 571564,
            "type": "choice",
            "difficulty": "Fácil",
            "question": "Escolha a opção correta: \"Ela saiu cedo, ___ esqueceu o guarda-chuva.\"",
            "options": [
              "mas",
              "mais",
              "más"
            ],
            "correct": "mas",
            "explanation": "Indica uma contradição ou oposição."
          },
          {
            "id": 571565,
            "type": "choice",
            "difficulty": "Fácil",
            "question": "Qual frase está correta?",
            "options": [
              "Quero mas sorvete.",
              "Quero mais sorvete.",
              "Quero más sorvete."
            ],
            "correct": "Quero mais sorvete.",
            "explanation": "Aqui \"mais\" indica maior quantidade."
          },
          {
            "id": 571566,
            "type": "choice",
            "difficulty": "Fácil",
            "question": "João tem ___ figurinhas que Pedro.",
            "options": [
              "mas",
              "mais",
              "más"
            ],
            "correct": "mais",
            "explanation": "Quantidade = Mais."
          },
          {
            "id": 571662,
            "type": "choice",
            "difficulty": "Moderado",
            "question": "Eles tentaram, ___ não conseguiram chegar a tempo.",
            "options": [
              "mas",
              "mais",
              "más"
            ],
            "correct": "mas",
            "explanation": "Oposição = Mas."
          },
          {
            "id": 571663,
            "type": "choice",
            "difficulty": "Moderado",
            "question": "Quanto ___ eu estudo, melhor eu fico.",
            "options": [
              "mas",
              "mais",
              "más"
            ],
            "correct": "mais",
            "explanation": "Intensidade/Quantidade = Mais."
          },
          {
            "id": 571664,
            "type": "choice",
            "difficulty": "Moderado",
            "question": "O sol está quente, ___ o vento está frio.",
            "options": [
              "mas",
              "mais",
              "más"
            ],
            "correct": "mas",
            "explanation": "Oposição = Mas."
          },
          {
            "id": 571665,
            "type": "choice",
            "difficulty": "Moderado",
            "question": "Gostaria de ir à festa, ___ estou cansado.",
            "options": [
              "mais",
              "mas",
              "más"
            ],
            "correct": "mas",
            "explanation": "Mas (porém) liga duas ideias contrárias."
          },
          {
            "id": 571666,
            "type": "choice",
            "difficulty": "Moderado",
            "question": "Adicione ___ sal na sopa, por favor.",
            "options": [
              "mais",
              "mas",
              "más"
            ],
            "correct": "mais",
            "explanation": "Mais indica aumento de quantidade."
          },
          {
            "type": "choice",
            "question": "A palavra que indica quantidade é:",
            "options": [
              "Mas",
              "Mais"
            ],
            "correct": "Mais",
            "explanation": "Mais é o oposto de menos.",
            "difficulty": "Fácil",
            "id": 960864
          },
          {
            "type": "choice",
            "question": "Complete: Corri muito, ______ não alcancei o ônibus.",
            "options": [
              "mas",
              "mais"
            ],
            "correct": "mas",
            "explanation": "'Mas' traz uma ideia contrária (porém, contudo).",
            "difficulty": "Moderado",
            "id": 960865
          },
          {
            "type": "choice",
            "question": "Qual destas frases usa 'mais' de forma errada?",
            "options": [
              "Quero mais tempo livre.",
              "Ele é o menino mais rápido.",
              "Vou descansar, mais volto logo."
            ],
            "correct": "Vou descansar, mais volto logo.",
            "explanation": "Aqui deveria ser 'mas' (porém).",
            "difficulty": "Difícil",
            "id": 960866
          },
          {
            "type": "choice",
            "question": "Ela é a garota _____ alta da escola.",
            "options": [
              "mas",
              "mais"
            ],
            "correct": "mais",
            "explanation": "Indica intensidade/quantidade.",
            "difficulty": "Fácil",
            "id": 960906
          },
          {
            "type": "choice",
            "question": "'Mais' funciona como qual classe gramatical quando indica intensidade?",
            "options": [
              "Substantivo",
              "Advérbio",
              "Conjunção"
            ],
            "correct": "Advérbio",
            "explanation": "Advérbio de intensidade.",
            "difficulty": "Difícil",
            "id": 960907
          },
          {
            "type": "choice",
            "question": "Tentei fugir, _____ fui pego.",
            "options": [
              "Mas",
              "Mais"
            ],
            "correct": "Mas",
            "explanation": "Conjunção adversativa.",
            "difficulty": "Moderado",
            "id": 960908
          }
        ]
      },
      "cedilha_til": {
        "title": "Cedilha e Til",
        "description": "Ç: Usado antes de A, O, U para som de S. Til (~): Indica som nasal (sai pelo nariz).",
        "studyContent": "**Sinais Especiais: Ç e ~**\n\n**1. A Cedilha (Ç)**\nÉ um \"penduricalho\" que colocamos embaixo do C para ele ficar com som de **S** quando vem antes de **A, O, U**.\n* Exemplos: Mo**ç**a, Abra**ç**o, Açúcar.\n* **Atenção:** Nunca usamos Ç antes de E ou I (porque o C sozinho já tem som de S nessas horas: Celular, Cinema) e **nunca** começamos palavras com ela!\n\n**2. O Til (~)**\nEle não é um acento de força, mas um sinal de \"nariz\"! Ele avisa que o som deve sair um pouco pelo nariz (som nasal).\n* Exemplos: Maç**ã**, avi**ão**, coraç**ão**, bal**õe**s.\n* Tente falar \"avião\" apertando o nariz e você vai sentir ele vibrar!",
        "questions": [
          {
            "id": 478368,
            "type": "choice",
            "question": "Qual a escrita correta da palavra?",
            "options": [
              "Pescoço",
              "Pescoco",
              "Pessoco"
            ],
            "correct": "Pescoço",
            "explanation": "Usamos Ç antes de O para som de S.",
            "difficulty": "Fácil"
          },
          {
            "id": 478369,
            "type": "choice",
            "question": "O sinal Til (~) em \"Maçã\" indica que o som é:",
            "options": [
              "Forte",
              "Nasal (pelo nariz)",
              "Mudo"
            ],
            "correct": "Nasal (pelo nariz)",
            "explanation": "O til indica que o ar sai também pelo nariz.",
            "difficulty": "Fácil"
          },
          {
            "id": 478370,
            "type": "choice",
            "question": "Podemos começar uma palavra com Ç?",
            "options": [
              "Sim",
              "Não"
            ],
            "correct": "Não",
            "explanation": "Nenhuma palavra na língua portuguesa começa com Cedilha.",
            "difficulty": "Fácil"
          },
          {
            "id": 478468,
            "type": "choice",
            "question": "Qual palavra usa Ç corretamente?",
            "options": [
              "Cebola",
              "Açúcar",
              "Bacia"
            ],
            "correct": "Açúcar",
            "explanation": "Usamos Ç antes de U. No início de palavras nunca usamos Ç.",
            "difficulty": "Moderado"
          },
          {
            "id": 478469,
            "type": "choice",
            "question": "O plural de \"Coração\" é \"Corações\". O som mudou por causa do:",
            "options": [
              "Acento agudo",
              "Til",
              "Cedilha"
            ],
            "correct": "Til",
            "explanation": "O til mantém o som nasal no plural.",
            "difficulty": "Moderado"
          },
          {
            "type": "choice",
            "question": "O til (~) indica um som:",
            "options": [
              "Nasal",
              "Aberto",
              "Surdo"
            ],
            "correct": "Nasal",
            "explanation": "O til faz o som sair também pelo nariz, como em 'Mãe'.",
            "difficulty": "Fácil",
            "id": 960867
          },
          {
            "type": "choice",
            "question": "Nunca usamos cedilha antes de quais vogais?",
            "options": [
              "a / o",
              "o / u",
              "e / i"
            ],
            "correct": "e / i",
            "explanation": "Antes de e ou i, a letra C já tem som de S. Ex: Cedo, Bacia.",
            "difficulty": "Moderado",
            "id": 960868
          },
          {
            "type": "choice",
            "question": "Assinale a alternativa onde todas as palavras usam ~ ou ç corretamente:",
            "options": [
              "Coração, Invenção, Açúcar",
              "Caroço, Pão, Facíl",
              "Sertão, Saci, Cãnela"
            ],
            "correct": "Coração, Invenção, Açúcar",
            "explanation": "Cânela não tem til e Facil é acento agudo.",
            "difficulty": "Difícil",
            "id": 960869
          },
          {
            "type": "choice",
            "question": "Posso usar ç no começo da palavra?",
            "options": [
              "Sim, desde que a vogal seja a/o/u",
              "Nunca se inicia palavra com cedilha"
            ],
            "correct": "Nunca se inicia palavra com cedilha",
            "explanation": "Regra básica da língua.",
            "difficulty": "Fácil",
            "id": 960909
          },
          {
            "type": "choice",
            "question": "O plural de 'Cidadão' é:",
            "options": [
              "Cidadãos",
              "Cidadões",
              "Cidadães"
            ],
            "correct": "Cidadãos",
            "explanation": "Guarda o radical no plural.",
            "difficulty": "Difícil",
            "id": 960910
          },
          {
            "type": "choice",
            "question": "Complete com SS ou Ç: A_úcar",
            "options": [
              "ss",
              "c",
              "ç"
            ],
            "correct": "ç",
            "explanation": "Açúcar usa Ç.",
            "difficulty": "Moderado",
            "id": 960911
          }
        ]
      },
      "pontuacao_1": {
        "title": "Sinais de Pontuação 1",
        "description": ".: Ponto Final (Fim de ideia). ?: Interrogação (Pergunta). !: Exclamação (Emoção/Surpresa).",
        "studyContent": "**Quem manda na frase? Os pontos!**\nOs sinais de pontuação são como as placas de trânsito da nossa leitura.\n\n**1. Ponto Final (.)**\nServe para encerrar uma ideia de forma calma. Você terminou de falar algo.\n* Exemplo: Eu gosto de ler**.**\n\n**2. Ponto de Interrogação (?)**\nO ponto dos curiosos! Usamos sempre que fazemos uma pergunta.\n* Exemplo: Você quer brincar**?**\n\n**3. Ponto de Exclamação (!)**\nO ponto das emoções! Usamos para gritar, mostrar surpresa, alegria, medo ou admiração.\n* Exemplo: Que susto**!** | Que dia lindo**!**",
        "questions": [
          {
            "id": 365157,
            "type": "choice",
            "question": "Para fazer uma pergunta, usamos o ponto de:",
            "options": [
              "Interrogação (?)",
              "Exclamação (!)",
              "Ponto Final (.)"
            ],
            "correct": "Interrogação (?)",
            "explanation": "O ponto de interrogação indica um questionamento.",
            "difficulty": "Fácil"
          },
          {
            "id": 365158,
            "type": "choice",
            "question": "\"Que dia maravilhoso!\" O ponto de exclamação indica:",
            "options": [
              "Uma pergunta",
              "Emoção ou Surpresa",
              "Fim de uma lista"
            ],
            "correct": "Emoção ou Surpresa",
            "explanation": "A exclamação é usada para expressar sentimentos, admiração ou sustos.",
            "difficulty": "Fácil"
          },
          {
            "id": 365159,
            "type": "choice",
            "question": "O ponto final (.) serve para:",
            "options": [
              "Começar uma fala",
              "Encerrar um pensamento ou ideia",
              "Duvidar de algo"
            ],
            "correct": "Encerrar um pensamento ou ideia",
            "explanation": "O ponto final indica que a frase terminou de forma declarativa.",
            "difficulty": "Fácil"
          },
          {
            "id": 365160,
            "type": "choice",
            "question": "Qual frase está pontuada corretamente para uma PERGUNTA?",
            "options": [
              "Você quer brincar?",
              "Você quer brincar!",
              "Você quer brincar."
            ],
            "correct": "Você quer brincar?",
            "explanation": "Perguntas devem terminar obrigatoriamente com interrogação.",
            "difficulty": "Fácil"
          },
          {
            "id": 365257,
            "type": "choice",
            "question": "\"Socorro!\" A pontuação indica:",
            "options": [
              "Uma dúvida",
              "Urgência ou Susto",
              "Uma afirmação calma"
            ],
            "correct": "Urgência ou Susto",
            "explanation": "A exclamação reforça a intensidade da mensagem e a emoção.",
            "difficulty": "Moderado"
          },
          {
            "type": "choice",
            "question": "Sinal que usamos para fazer uma pergunta:",
            "options": [
              "Ponto Final",
              "Ponto de Interrogação (?)",
              "Ponto de Exclamação (!)"
            ],
            "correct": "Ponto de Interrogação (?)",
            "explanation": "Indica indagação, questionamento.",
            "difficulty": "Fácil",
            "id": 960870
          },
          {
            "type": "choice",
            "question": "Para que serve a Círgula (,) numa frase?",
            "options": [
              "Terminar um texto",
              "Fazer uma pequena pausa ou separar itens",
              "Indicar exclamação"
            ],
            "correct": "Fazer uma pequena pausa ou separar itens",
            "explanation": "A vírgula dá ritmo ao texto e enumera elementos.",
            "difficulty": "Moderado",
            "id": 960871
          },
          {
            "type": "choice",
            "question": "Em qual cenário usaríamos os Dois-pontos (:) ?",
            "options": [
              "Antes de listar coisas ou de uma fala",
              "Ao final da história",
              "Para indicar surpresa"
            ],
            "correct": "Antes de listar coisas ou de uma fala",
            "explanation": "Apresenta uma enumeração, explicação ou fala de um personagem.",
            "difficulty": "Difícil",
            "id": 960872
          },
          {
            "type": "choice",
            "question": "Se uma frase não tem emoção nenhuma e só diz um fato, encerra com:",
            "options": [
              "Ponto de exclamação",
              "Ponto Final",
              "Reticências"
            ],
            "correct": "Ponto Final",
            "explanation": "Sentença declarativa.",
            "difficulty": "Fácil",
            "id": 960912
          },
          {
            "type": "choice",
            "question": "A vírgula separa elementos de um lugar longo, como o endereço:",
            "options": [
              "Falso",
              "Verdadeiro"
            ],
            "correct": "Verdadeiro",
            "explanation": "Exemplo: Rua Azul, 12, Campinas.",
            "difficulty": "Moderado",
            "id": 960913
          },
          {
            "type": "choice",
            "question": "O que o Ponto e Vírgula (;) representa em relação à pausa?",
            "options": [
              "Menor que a vírgula",
              "Maior que a vírgula, menor que o ponto final",
              "Um encerramento definitivo"
            ],
            "correct": "Maior que a vírgula, menor que o ponto final",
            "explanation": "Serve como uma transição mais longa que a vírgula.",
            "difficulty": "Difícil",
            "id": 960914
          }
        ]
      },
      "pontuacao_2": {
        "title": "Sinais de Pontuação 2",
        "description": "Virgula (,): Pausa/Lista. Dois-pontos (:): Explicação/Fala. Travessão (—): Fala. Reticências (...): Hesitação.",
        "studyContent": "**Pontuação Especial: Pausas e Falas**\n\n**1. Vírgula (,)**\nIndica uma pequena pausa para respirar. Também serve para separar itens em uma lista.\n* Exemplo: Comprei maçã**,** uva**,** pera e melancia.\n\n**2. Dois-pontos (:)**\nAvisam que algo importante vai acontecer: uma explicação, uma lista ou que alguém vai falar.\n* Exemplo: Ele disse**:** — Vou sair agora.\n\n**3. Travessão (—)**\nAvisa que o personagem começou a falar agora mesmo!\n* Exemplo: **—** Bom dia, professora!\n\n**4. Reticências (...)**\nAquelas três bolinhas que mostram que o pensamento continuou ou que a pessoa está em dúvida.\n* Exemplo: Eu acho que... não sei bem.",
        "questions": [
          {
            "id": 776203,
            "type": "choice",
            "question": "Qual sinal usamos para indicar uma PAUSA no meio da frase?",
            "options": [
              "Ponto Final",
              "Vírgula",
              "Exclamação"
            ],
            "correct": "Vírgula",
            "explanation": "A vírgula indica uma pequena pausa para fôlego ou separação de elementos.",
            "difficulty": "Fácil"
          },
          {
            "id": 776204,
            "type": "choice",
            "question": "Na lista \"Comprei maçã, uva e pera\", a VÍRGULA foi usada para:",
            "options": [
              "Separar itens de uma lista",
              "Marcar uma pergunta",
              "Indicar que alguém falou"
            ],
            "correct": "Separar itens de uma lista",
            "explanation": "Usamos vírgulas para separar elementos enumerados.",
            "difficulty": "Fácil"
          },
          {
            "id": 776303,
            "type": "choice",
            "question": "Qual sinal indica que um personagem vai começar a FALAR?",
            "options": [
              "Dois-pontos (:)",
              "Ponto Final (.)",
              "Vírgula (,)"
            ],
            "correct": "Dois-pontos (:)",
            "explanation": "Os dois-pontos preparam o leitor para o diálogo ou uma explicação.",
            "difficulty": "Moderado"
          },
          {
            "id": 776304,
            "type": "choice",
            "question": "Qual o sinal que aparece no INÍCIO da fala de um personagem?",
            "options": [
              "Parênteses",
              "Travessão (—)",
              "Reticências"
            ],
            "correct": "Travessão (—)",
            "explanation": "O travessão marca o início de cada fala nos diálogos.",
            "difficulty": "Moderado"
          },
          {
            "id": 776305,
            "type": "choice",
            "question": "O que as RETICÊNCIAS (...) costumam indicar?",
            "options": [
              "Fim de mundo",
              "Suspensão de pensamento ou hesitação",
              "Uma pergunta surpresa"
            ],
            "correct": "Suspensão de pensamento ou hesitação",
            "explanation": "Indicam que o pensamento não foi concluído ou que há dúvida.",
            "difficulty": "Moderado"
          },
          {
            "type": "choice",
            "question": "Usamos o Ponto de Exclamação (!) para demonstrar:",
            "options": [
              "Uma dúvida",
              "Uma pequena pausa",
              "Surpresa ou forte emoção"
            ],
            "correct": "Surpresa ou forte emoção",
            "explanation": "Destaca medo, alegria, surpresa.",
            "difficulty": "Fácil",
            "id": 960873
          },
          {
            "type": "choice",
            "question": "Qual parênteses está usado de forma correta para dar uma explicação?",
            "options": [
              "O Brasil, (o maior país da América do Sul) é rico.",
              "O Brasil (maior país da), América do Sul.",
              "(O Brasil é) grande."
            ],
            "correct": "O Brasil, (o maior país da América do Sul) é rico.",
            "explanation": "Os parênteses isolam a informação extra.",
            "difficulty": "Moderado",
            "id": 960874
          },
          {
            "type": "choice",
            "question": "Qual a função das Reticências (...) ?",
            "options": [
              "Encerrar o texto",
              "Indicar que um pensamento continua ou dá hesitação",
              "Separar frases completas"
            ],
            "correct": "Indicar que um pensamento continua ou dá hesitação",
            "explanation": "Traz a ideia de pausa dramática ou continuidade.",
            "difficulty": "Difícil",
            "id": 960875
          },
          {
            "type": "choice",
            "question": "As aspas servem para:",
            "options": [
              "Gritar no texto",
              "Destacar uma gíria ou indicar a cópia de um texto de terceiros",
              "Fazer perguntas"
            ],
            "correct": "Destacar uma gíria ou indicar a cópia de um texto de terceiros",
            "explanation": "Destaque e citações dependem das aspas.",
            "difficulty": "Moderado",
            "id": 960915
          },
          {
            "type": "choice",
            "question": "O que indica falas intermitentes, hesitação (hã... será...)?",
            "options": [
              "Ponto Final",
              "Reticências",
              "Dois pontos"
            ],
            "correct": "Reticências",
            "explanation": "Mostram que o pensamento continua ou gaguejou.",
            "difficulty": "Fácil",
            "id": 960916
          },
          {
            "type": "choice",
            "question": "Pode-se usar o ponto de exclamação dentro dos parênteses?",
            "options": [
              "Não, é proibido",
              "Sim (para indicar ironia ou espanto na nota explicativa!)"
            ],
            "correct": "Sim (para indicar ironia ou espanto na nota explicativa!)",
            "explanation": "Expressa emoção em uma nota à parte.",
            "difficulty": "Difícil",
            "id": 960917
          }
        ]
      },
      "ditado": {
        "title": "Ditado",
        "description": "Escrita correta de palavras complexas (SS, RR, Ç, CH, G/J).",
        "studyContent": "**Hora do Ditado!**\nEscrever bem é como praticar um esporte: quanto mais a gente faz, melhor a gente fica!\n\n**Dicas para não errar:**\n* **SS e RR:** Nunca usamos dois S ou dois R no começo de uma palavra. Eles só aparecem no meio, entre vogais, para ficarem fortes! (Ex: Pa**ss**arinho, Ca**rr**o).\n* **G ou J:** Antes de E e I, eles têm o mesmo som! Por isso, precisamos ler bastante para decorar quais palavras usam cada um. (Ex: Reló**g**io, **J**eito).\n* **CH:** Tem som de X, mas se escreve diferente. (Ex: **Ch**ocolate).\n\nPreste muita atenção ao som e tente visualizar a palavra na sua cabeça!",
        "questions": [
          {
            "id": 405193,
            "type": "dictation",
            "question": "Escreva a palavra que você ouviu:",
            "correct": "Exceção",
            "explanation": "Exceção se escreve com EX e Ç.",
            "difficulty": "Fácil"
          },
          {
            "id": 405195,
            "type": "dictation",
            "question": "Escreva a word que você ouviu:",
            "correct": "Carroça",
            "explanation": "Carroça se escreve com RR e Ç.",
            "difficulty": "Fácil"
          },
          {
            "type": "dictation",
            "question": "Escreva a palavra que ouviu.",
            "options": [
              "cachorro",
              "carro",
              "pássaro"
            ],
            "correct": "cachorro",
            "explanation": "Palavra com ch e rr.",
            "difficulty": "Fácil",
            "id": 960876
          },
          {
            "type": "dictation",
            "question": "Escreva a palavra corretamente.",
            "options": [
              "excessão",
              "exceção",
              "eceção"
            ],
            "correct": "exceção",
            "explanation": "Exceção é com xc e ç.",
            "difficulty": "Moderado",
            "id": 960877
          },
          {
            "type": "dictation",
            "question": "Ditado difícil: escreva.",
            "options": [
              "beneficente",
              "beneficiente",
              "benificiente"
            ],
            "correct": "beneficente",
            "explanation": "O termo correto não possui 'i' após o 'c'.",
            "difficulty": "Difícil",
            "id": 960878
          },
          {
            "type": "dictation",
            "question": "Escreva a palavra certa.",
            "options": [
              "compreensão",
              "comprienção",
              "comprenssão"
            ],
            "correct": "compreensão",
            "explanation": "Do verbo compreender.",
            "difficulty": "Moderado",
            "id": 960918
          },
          {
            "type": "dictation",
            "question": "Ouça a palavra e escreva.",
            "options": [
              "bisavó",
              "bizavó",
              "bisavô"
            ],
            "correct": "bisavó",
            "explanation": "Escrito com s com som de z, acento na última (ó).",
            "difficulty": "Fácil",
            "id": 960919
          },
          {
            "type": "dictation",
            "question": "Ditado final.",
            "options": [
              "ascensão",
              "assensão",
              "ascenção"
            ],
            "correct": "ascensão",
            "explanation": "Subir. Vem de ascender. Termina com 'são'.",
            "difficulty": "Difícil",
            "id": 960920
          }
        ]
      },
      "literatura": {
        "title": "Literatura",
        "description": "Análise Literária: Pequeno pode tudo (Pedro Bandeira).",
        "videoUrl": "https://www.youtube.com/embed/WgIyhVaHDJo",
        "studyContent": "**Explorando o Livro: \"Pequeno pode tudo\"**\nVamos mergulhar na obra de **Pedro Bandeira** (Editora Moderna) e descobrir como as palavras podem criar mundos!\n\n**Resenha do Livro:**\n*Pequeno pode tudo* é uma história maravilhosa que nos mostra que o tamanho não define o que podemos fazer. O autor usa muita imaginação para mostrar que ser criança é um superpoder! Através de rimas e brincadeiras com as palavras, o livro incentiva o pensamento crítico e a autoestima, mostrando que o mundo é cheio de possibilidades para quem sabe olhar com criatividade.\n\n**Tipos de Histórias: Conto e Fábula**\nExistem jeitos diferentes de contar histórias, e cada um tem sua característica:\n\n1. **Conto:** É uma história curta que foca em um único conflito ou aventura. Pode ser sobre coisas reais ou magias. Tem poucos personagens e o tempo passa rapidinho.\n2. **Fábula:** É um tipo especial de história onde os **animais** são os personagens principais (eles falam e agem como gente!). No final de toda fábula, existe sempre uma **\"Moral da História\"**, que é uma lição ou ensinamento importante para a nossa vida.\n\n**Sentido Literal vs. Figurado**\n*   **Sentido Literal:** É o sentido real da palavra. Ex: \"O menino é pequeno\" (ele tem baixa estatura).\n*   **Sentido Figurado:** É o sentido imaginário. Ex: \"Pequeno pode tudo\" (aqui 'pequeno' representa o potencial da infância, não só o tamanho).",
        "questions": [
          {
            "id": 471262,
            "type": "choice",
            "question": "Quem escreveu o livro \"Pequeno pode tudo\"?",
            "options": [
              "Pedro Bandeira",
              "Ruth Rocha",
              "Ziraldo"
            ],
            "correct": "Pedro Bandeira",
            "explanation": "Pedro Bandeira é um dos mais famosos autores de literatura infantojuvenil do Brasil.",
            "difficulty": "Fácil"
          },
          {
            "id": 471263,
            "type": "choice",
            "question": "Qual editora publicou esta obra?",
            "options": [
              "Moderna",
              "Ática",
              "Rocco"
            ],
            "correct": "Moderna",
            "explanation": "O livro faz parte do catálogo da Editora Moderna.",
            "difficulty": "Fácil"
          },
          {
            "id": 471264,
            "type": "choice",
            "question": "O que significa o sentido LITERAL de uma palavra?",
            "options": [
              "O sentido real e exato",
              "Um sentido inventado",
              "Um desenho"
            ],
            "correct": "O sentido real e exato",
            "explanation": "É o sentido básico da palavra, como ela é na realidade.",
            "difficulty": "Fácil"
          },
          {
            "id": 471362,
            "type": "choice",
            "question": "Quando dizemos que \"alguém é uma fera\" em matemática, estamos usando o sentido:",
            "options": [
              "Literal (ele virou bicho)",
              "Figurado (ele é muito bom)",
              "Errado"
            ],
            "correct": "Figurado (ele é muito bom)",
            "explanation": "Sentido figurado usa a imaginação para comparar qualidades.",
            "difficulty": "Moderado"
          },
          {
            "id": 471363,
            "type": "choice",
            "question": "Por que o autor usa uma linguagem simples no livro?",
            "options": [
              "Porque ele esqueceu as palavras difíceis",
              "Para se adequar ao público infantil",
              "Porque o livro é pequeno"
            ],
            "correct": "Para se adequar ao público infantil",
            "explanation": "Autores adaptam a escrita para que o leitor entenda e goste da história.",
            "difficulty": "Moderado"
          },
          {
            "type": "choice",
            "question": "Os contos de fadas geralmente começam com:",
            "options": [
              "Era uma vez...",
              "E assim todos...",
              "Prezados,"
            ],
            "correct": "Era uma vez...",
            "explanation": "Fórmula clássica para indicar tempo passado irreal.",
            "difficulty": "Fácil",
            "id": 960879
          },
          {
            "type": "choice",
            "question": "Quem conta a história em um livro?",
            "options": [
              "O personagem",
              "O narrador",
              "O ilustrador"
            ],
            "correct": "O narrador",
            "explanation": "O narrador é a voz que relata os fatos.",
            "difficulty": "Moderado",
            "id": 960880
          },
          {
            "type": "choice",
            "question": "O clímax de uma história é considerado:",
            "options": [
              "O seu começo",
              "O nível de maior tensão e emoção",
              "O desfecho final"
            ],
            "correct": "O nível de maior tensão e emoção",
            "explanation": "É a reviravolta onde tudo pode ser resolvido.",
            "difficulty": "Difícil",
            "id": 960881
          },
          {
            "type": "choice",
            "question": "As rimas em uma poesia significam:",
            "options": [
              "Desenhos ao canto da página",
              "Sons semelhantes no fim (ou no meio) dos versos",
              "O título da poesia"
            ],
            "correct": "Sons semelhantes no fim (ou no meio) dos versos",
            "explanation": "Traz musicalidade ao poema.",
            "difficulty": "Fácil",
            "id": 960921
          },
          {
            "type": "choice",
            "question": "Uma estrofe é:",
            "options": [
              "Um conjunto de versos (linhas)",
              "O autor do poema",
              "Um erro de ortografia"
            ],
            "correct": "Um conjunto de versos (linhas)",
            "explanation": "Agrupamento de linhas na poesia.",
            "difficulty": "Moderado",
            "id": 960922
          },
          {
            "type": "choice",
            "question": "O que é Métrica em Literatura?",
            "options": [
              "A medida da capa do livro",
              "A contagem das sílabas poéticas num verso",
              "A fonte das letras"
            ],
            "correct": "A contagem das sílabas poéticas num verso",
            "explanation": "Estrutura rítmica regrada.",
            "difficulty": "Difícil",
            "id": 960923
          }
        ]
      }
    }
  },
  "matematica": {
    "title": "Matemática",
    "id": "matematica",
    "icon": "🔢",
    "color": "blue",
    "modules": {
      "operacoes": {
        "title": "Operações Básicas",
        "description": "Soma, subtração e multiplicação.",
        "studyContent": "**Matemática nas pontas dos dedos!**\nAs operações básicas são como as ferramentas de um mestre de obras. Vamos relembrar como usar cada uma:\n\n**1. SOMA (+) — Juntar e Adicionar**\nÉ quando a gente ganha algo ou junta grupos.\n* Exemplo: Se você tem 10 balas e ganha mais 5, você fica com 15!\n\n**2. SUBTRAÇÃO (-) — Tirar e Comparar**\nÉ quando a gente perde algo, gasta ou quer saber a diferença.\n* Exemplo: Se você tinha 20 figurinhas e deu 7 para um amigo, sobraram 13.\n\n**3. MULTIPLICAÇÃO (x) — Soma repetida**\nEm vez de somar muitas vezes o mesmo número, a gente multiplica!\n* Exemplo: 3 x 4 é a mesma coisa que 4 + 4 + 4. Dá 12!\n\n**Dica:** Pratique a tabuada como se fosse uma música, fica muito mais fácil decorar!",
        "questions": [
          {
            "id": 960651,
            "type": "choice",
            "question": "Quanto é 25 + 15?",
            "options": [
              "35",
              "40",
              "45"
            ],
            "correct": "40",
            "explanation": "25 + 15 = 40.",
            "difficulty": "Fácil"
          },
          {
            "id": 960652,
            "type": "choice",
            "question": "Se eu tenho 5 notas de 2 reais, quantos reais eu tenho?",
            "options": [
              "10",
              "15",
              "20"
            ],
            "correct": "10",
            "explanation": "5 x 2 = 10.",
            "difficulty": "Fácil"
          },
          {
            "id": 960653,
            "type": "choice",
            "question": "Quanto é 45 + 55?",
            "options": [
              "90",
              "100",
              "110"
            ],
            "correct": "100",
            "explanation": "Soma redonda.",
            "difficulty": "Fácil"
          },
          {
            "id": 960751,
            "type": "choice",
            "question": "Quanto é 7 x 8?",
            "options": [
              "54",
              "56",
              "64"
            ],
            "correct": "56",
            "explanation": "Tabuada do 7.",
            "difficulty": "Moderado"
          },
          {
            "id": 960752,
            "type": "choice",
            "question": "Quanto é 100 - 37?",
            "options": [
              "63",
              "73",
              "53"
            ],
            "correct": "63",
            "explanation": "Subtração básica.",
            "difficulty": "Moderado"
          },
          {
            "id": 960753,
            "type": "choice",
            "question": "Qual o triplo de 9?",
            "options": [
              "18",
              "27",
              "36"
            ],
            "correct": "27",
            "explanation": "9 x 3 = 27.",
            "difficulty": "Moderado"
          },
          {
            "id": 960754,
            "type": "choice",
            "question": "Quanto é 6 x 6?",
            "options": [
              "30",
              "36",
              "42"
            ],
            "correct": "36",
            "explanation": "Tabuada do 6.",
            "difficulty": "Moderado"
          },
          {
            "id": 960755,
            "type": "choice",
            "question": "Um carro tem 4 rodas. 10 carros têm:",
            "options": [
              "20",
              "40",
              "50"
            ],
            "correct": "40",
            "explanation": "4 x 10.",
            "difficulty": "Moderado"
          },
          {
            "id": 960851,
            "type": "choice",
            "question": "Se eu dividir 12 balas para 3 crianças, cada uma ganha:",
            "options": [
              "3",
              "4",
              "5"
            ],
            "correct": "4",
            "explanation": "12 / 3 = 4.",
            "difficulty": "Difícil"
          },
          {
            "type": "choice",
            "question": "Quanto é 5 mais 7?",
            "options": [
              "10",
              "12",
              "11"
            ],
            "correct": "12",
            "explanation": "5 + 7 = 12.",
            "difficulty": "Fácil",
            "id": 960882
          },
          {
            "type": "choice",
            "question": "Se eu tenho 25 lápis e comprei mais 16, com quantos fiquei?",
            "options": [
              "31",
              "41",
              "51"
            ],
            "correct": "41",
            "explanation": "25 + 16 = 41",
            "difficulty": "Moderado",
            "id": 960883
          },
          {
            "type": "choice",
            "question": "Divida 144 por 12:",
            "options": [
              "11",
              "12",
              "13"
            ],
            "correct": "12",
            "explanation": "12 x 12 = 144.",
            "difficulty": "Difícil",
            "id": 960884
          },
          {
            "type": "choice",
            "question": "Em 4 x 3 = 12, os números 4 e 3 recebem o nome de:",
            "options": [
              "Soma",
              "Fatores",
              "Produto"
            ],
            "correct": "Fatores",
            "explanation": "Os números que se multiplicam chamam-se fatores.",
            "difficulty": "Moderado",
            "id": 960924
          },
          {
            "type": "choice",
            "question": "Na subtração, o número de onde se diminui é chamado de:",
            "options": [
              "Total",
              "Minuendo",
              "Resto"
            ],
            "correct": "Minuendo",
            "explanation": "Subtraendo é tirado do minuendo.",
            "difficulty": "Difícil",
            "id": 960925
          },
          {
            "type": "choice",
            "question": "Subtraia: 15 - 8",
            "options": [
              "6",
              "7",
              "8"
            ],
            "correct": "7",
            "explanation": "15-8 = 7.",
            "difficulty": "Fácil",
            "id": 960926
          }
        ]
      },
      "geometria": {
        "title": "Geometria",
        "description": "Formas geométricas e medidas básicas.",
        "studyContent": "**O Mundo das Formas!**\nTudo o que vemos tem uma forma. Na geometria, damos nomes especiais para elas:\n\n**1. Formas Planas (Desenhos no papel):**\n* **Triângulo:** Tem 3 lados e 3 pontas (vértices).\n* **Quadrado:** Tem 4 lados iguaizinhos.\n* **Círculo:** É todo redondinho, não tem pontas.\n\n**2. Formas Espaciais (Objetos que podemos pegar):**\n* **Esfera:** Parece uma bola de futebol.\n* **Cubo:** Parece um dado.\n* **Cilindro:** Parece uma lata de refrigerante.\n* **Cone:** Parece um chapéu de festa ou casquinha de sorvete.\n\n**Vértices:** São os \"cantinhos\" onde as linhas se encontram!",
        "questions": [
          {
            "id": 752188,
            "type": "choice",
            "question": "Qual forma tem 3 lados?",
            "options": [
              "Quadrado",
              "Círculo",
              "Triângulo"
            ],
            "correct": "Triângulo",
            "explanation": "Tri = 3.",
            "difficulty": "Fácil"
          },
          {
            "id": 752189,
            "type": "choice",
            "question": "Qual forma tem 4 lados iguais?",
            "options": [
              "Retângulo",
              "Quadrado",
              "Losango"
            ],
            "correct": "Quadrado",
            "explanation": "Lados iguais e 4 cantos retos.",
            "difficulty": "Fácil"
          },
          {
            "id": 752190,
            "type": "choice",
            "question": "A bola tem o formato de uma:",
            "options": [
              "Esfera",
              "Cubo",
              "Cilindro"
            ],
            "correct": "Esfera",
            "explanation": "Forma circular em 3D.",
            "difficulty": "Fácil"
          },
          {
            "id": 752288,
            "type": "choice",
            "question": "Um dado tem o formato de:",
            "options": [
              "Cubo",
              "Cone",
              "Pirâmide"
            ],
            "correct": "Cubo",
            "explanation": "6 faces quadradas.",
            "difficulty": "Moderado"
          },
          {
            "id": 752388,
            "type": "choice",
            "question": "Um triângulo com 3 lados iguais chama-se:",
            "options": [
              "Equilátero",
              "Isósceles",
              "Escaleno"
            ],
            "correct": "Equilátero",
            "explanation": "Equi = igual.",
            "difficulty": "Difícil"
          },
          {
            "type": "choice",
            "question": "Quantos lados tem um Triângulo?",
            "options": [
              "2",
              "3",
              "4"
            ],
            "correct": "3",
            "explanation": "Tri (três) + ângulo.",
            "difficulty": "Fácil",
            "id": 960885
          },
          {
            "type": "choice",
            "question": "Qual forma de 4 lados iguais possui ângulos retos de 90°?",
            "options": [
              "Losango",
              "Quadrado",
              "Retângulo"
            ],
            "correct": "Quadrado",
            "explanation": "Lados iguais e ângulos de 90 graus.",
            "difficulty": "Moderado",
            "id": 960886
          },
          {
            "type": "choice",
            "question": "A soma dos ângulos internos de um triângulo é:",
            "options": [
              "360°",
              "180°",
              "90°"
            ],
            "correct": "180°",
            "explanation": "A soma é sempre 180 graus.",
            "difficulty": "Difícil",
            "id": 960887
          },
          {
            "type": "choice",
            "question": "Um hexágono possui:",
            "options": [
              "5 lados",
              "6 lados",
              "8 lados"
            ],
            "correct": "6 lados",
            "explanation": "Hexa = seis.",
            "difficulty": "Moderado",
            "id": 960927
          },
          {
            "type": "choice",
            "question": "A linha reta que divide o círculo exatamente ao meio é:",
            "options": [
              "Corda",
              "Raio",
              "Diâmetro"
            ],
            "correct": "Diâmetro",
            "explanation": "Passa pelo centro, igual a dois raios.",
            "difficulty": "Difícil",
            "id": 960928
          },
          {
            "type": "choice",
            "question": "Qual é a forma de uma bola?",
            "options": [
              "Círculo",
              "Esfera",
              "Cilindro"
            ],
            "correct": "Esfera",
            "explanation": "Círculo é 2D. Esfera é 3D.",
            "difficulty": "Fácil",
            "id": 960929
          }
        ]
      }
    }
  },
  "historia": {
    "title": "História",
    "id": "historia",
    "icon": "🏰",
    "color": "red",
    "modules": {
      "brasil": {
        "title": "História do Brasil",
        "description": "Descobrimento e fatos históricos.",
        "studyContent": "**Uma Viagem no Tempo pelo Brasil!**\nA nossa história é cheia de aventuras e momentos importantes. Vamos ver alguns:\n\n**1. O Início (1500):**\nPedro Álvares Cabral chegou aqui com suas caravelas. Ele buscava as Índias, mas encontrou uma terra linda onde já viviam os **Indígenas**.\n\n**2. Independência (1822):**\nDom Pedro I deu o famoso grito \"Independência ou Morte!\" no Rio Ipiranga. O Brasil deixou de ser colônia de Portugal.\n\n**3. Abolição (1888):**\nA Princesa Isabel assinou a Lei Áurea, acabando com a escravidão no nosso país.\n\n**4. República (1889):**\nO Brasil deixou de ter imperadores e passou a ter presidentes, como é até hoje!",
        "questions": [
          {
            "id": 390705,
            "type": "choice",
            "question": "Em que ano o Brasil foi descoberto?",
            "options": [
              "1492",
              "1500",
              "1822"
            ],
            "correct": "1500",
            "explanation": "Pedro Álvares Cabral chegou em 1500.",
            "difficulty": "Fácil"
          },
          {
            "id": 390706,
            "type": "choice",
            "question": "Qual o nome do primeiro navegador a chegar ao Brasil?",
            "options": [
              "Cristóvão Colombo",
              "Pedro Álvares Cabral",
              "Vasco da Gama"
            ],
            "correct": "Pedro Álvares Cabral",
            "explanation": "Comandante da frota portuguesa.",
            "difficulty": "Fácil"
          },
          {
            "id": 390707,
            "type": "choice",
            "question": "Qual era o principal produto levado pelos portugueses no início?",
            "options": [
              "Ouro",
              "Pau-brasil",
              "Café"
            ],
            "correct": "Pau-brasil",
            "explanation": "Madeira usada para tingir tecidos.",
            "difficulty": "Fácil"
          },
          {
            "id": 390708,
            "type": "choice",
            "question": "Quem eram os habitantes do Brasil antes dos portugueses?",
            "options": [
              "Espanhóis",
              "Indígenas",
              "Franceses"
            ],
            "correct": "Indígenas",
            "explanation": "Os povos nativos que já viviam aqui.",
            "difficulty": "Fácil"
          },
          {
            "id": 390709,
            "type": "choice",
            "question": "Quem gritou \"Independência ou Morte\"?",
            "options": [
              "D. Pedro I",
              "D. Pedro II",
              "Cabral"
            ],
            "correct": "D. Pedro I",
            "explanation": "Dom Pedro I no Ipiranga.",
            "difficulty": "Fácil"
          },
          {
            "id": 390710,
            "type": "choice",
            "question": "A Princesa Isabel assinou qual lei?",
            "options": [
              "Lei do Café",
              "Lei Áurea",
              "Lei das Águas"
            ],
            "correct": "Lei Áurea",
            "explanation": "Aboliu a escravidão.",
            "difficulty": "Fácil"
          },
          {
            "id": 390711,
            "type": "choice",
            "question": "O Brasil foi colônia de quem?",
            "options": [
              "Espanha",
              "França",
              "Portugal"
            ],
            "correct": "Portugal",
            "explanation": "História colonial.",
            "difficulty": "Fácil"
          },
          {
            "id": 390805,
            "type": "choice",
            "question": "A Independência do Brasil aconteceu em:",
            "options": [
              "1500",
              "1822",
              "1889"
            ],
            "correct": "1822",
            "explanation": "7 de setembro de 1822.",
            "difficulty": "Moderado"
          },
          {
            "type": "choice",
            "question": "Quem descobriu o Brasil para a história europeia?",
            "options": [
              "Pedro Álvares Cabral",
              "Cristóvão Colombo"
            ],
            "correct": "Pedro Álvares Cabral",
            "explanation": "Chegou ao Brasil em 1500.",
            "difficulty": "Fácil",
            "id": 960888
          },
          {
            "type": "choice",
            "question": "Qual foi a primeira capital do Brasil?",
            "options": [
              "Rio de Janeiro",
              "Salvador",
              "São Paulo"
            ],
            "correct": "Salvador",
            "explanation": "Salvador, na Bahia, foi a primeira capital.",
            "difficulty": "Moderado",
            "id": 960889
          },
          {
            "type": "choice",
            "question": "Em que ano a República Brasileira foi proclamada?",
            "options": [
              "1822",
              "1889",
              "1888"
            ],
            "correct": "1889",
            "explanation": "Ocorreu em 15 de novembro de 1889.",
            "difficulty": "Difícil",
            "id": 960890
          },
          {
            "type": "choice",
            "question": "Quem declarou a 'Independência do Brasil'?",
            "options": [
              "Pedro Álvares Cabral",
              "Dom Pedro I",
              "Tiradentes"
            ],
            "correct": "Dom Pedro I",
            "explanation": "O príncipe regente em 1822 às margens do rio Ipiranga.",
            "difficulty": "Moderado",
            "id": 960930
          },
          {
            "type": "choice",
            "question": "A Lei Áurea, que aboliu a escravidão, foi promulgada por:",
            "options": [
              "Princesa Isabel",
              "Dom João VI",
              "Floriano Peixoto"
            ],
            "correct": "Princesa Isabel",
            "explanation": "Assinou a lei em 13 de Maio de 1888.",
            "difficulty": "Difícil",
            "id": 960931
          },
          {
            "type": "choice",
            "question": "Tiradentes participou de qual revolta importante?",
            "options": [
              "Inconfidência Mineira",
              "Revolta da Vacina"
            ],
            "correct": "Inconfidência Mineira",
            "explanation": "A revolta aconteceu em Minas Gerais contra Portugal.",
            "difficulty": "Fácil",
            "id": 960932
          }
        ]
      }
    }
  },
  "geografia": {
    "title": "Geografia",
    "id": "geografia",
    "icon": "🌍",
    "color": "green",
    "modules": {
      "mapas": {
        "title": "Mapas e Clima",
        "description": "Estados, capitais e meio ambiente.",
        "studyContent": "**Explorando o nosso Planeta!**\nA Geografia nos ajuda a entender onde estamos e como a natureza funciona.\n\n**1. Onde estamos?**\nO Brasil fica na **América do Sul** e nossa capital é **Brasília**. O país é dividido em 5 regiões: Norte, Nordeste, Centro-Oeste, Sudeste e Sul.\n\n**2. Pontos Cardeais (Orientação):**\n* **Norte (N), Sul (S), Leste (L) e Oeste (O).**\n* O Sol nasce no **Leste** e se põe no **Oeste**!\n\n**3. Clima e Natureza:**\nO Brasil é um país tropical (quente!), mas tem muitos biomas diferentes, como a **Amazônia** (muitas árvores e chuva) e a **Caatinga** (mais seco e exclusivo do Brasil).",
        "questions": [
          {
            "id": 717272,
            "type": "choice",
            "question": "Qual a capital do Brasil?",
            "options": [
              "Rio de Janeiro",
              "São Paulo",
              "Brasília"
            ],
            "correct": "Brasília",
            "explanation": "Brasília é a capital federal.",
            "difficulty": "Fácil"
          },
          {
            "id": 717273,
            "type": "choice",
            "question": "Em qual continente fica o Brasil?",
            "options": [
              "América",
              "Europa",
              "África"
            ],
            "correct": "América",
            "explanation": "América do Sul.",
            "difficulty": "Fácil"
          },
          {
            "id": 717274,
            "type": "choice",
            "question": "Quantas regiões tem o Brasil?",
            "options": [
              "4",
              "5",
              "6"
            ],
            "correct": "5",
            "explanation": "Norte, Nordeste, Centro-Oeste, Sudeste e Sul.",
            "difficulty": "Fácil"
          },
          {
            "id": 717275,
            "type": "choice",
            "question": "Qual oceano banha o Brasil?",
            "options": [
              "Pacífico",
              "Índico",
              "Atlântico"
            ],
            "correct": "Atlântico",
            "explanation": "Toda a nossa costa leste.",
            "difficulty": "Fácil"
          },
          {
            "id": 717372,
            "type": "choice",
            "question": "Qual o maior bioma do Brasil?",
            "options": [
              "Cerrado",
              "Amazônia",
              "Pantanal"
            ],
            "correct": "Amazônia",
            "explanation": "A maior floresta tropical do mundo.",
            "difficulty": "Moderado"
          },
          {
            "type": "choice",
            "question": "Para que serve a Bússola?",
            "options": [
              "Medir calor",
              "Indicar direções (Norte, Sul...)",
              "Marcar a hora"
            ],
            "correct": "Indicar direções (Norte, Sul...)",
            "explanation": "Instrumento de orientação geográfica.",
            "difficulty": "Fácil",
            "id": 960891
          },
          {
            "type": "choice",
            "question": "Na Rosa dos Ventos, o Leste é por onde o sol:",
            "options": [
              "Nasce",
              "Se põe",
              "Fica ao meio-dia"
            ],
            "correct": "Nasce",
            "explanation": "Leste (ou Oriente) é onde o sol surge pela manhã.",
            "difficulty": "Moderado",
            "id": 960892
          },
          {
            "type": "choice",
            "question": "Qual nome se dá à linha imaginária que divide a Terra em Norte e Sul?",
            "options": [
              "Trópico de Capricórnio",
              "Equador",
              "Meridiano de Greenwich"
            ],
            "correct": "Equador",
            "explanation": "É a linha paralela de 0 graus.",
            "difficulty": "Difícil",
            "id": 960893
          },
          {
            "type": "choice",
            "question": "O Brasil fica no continente:",
            "options": [
              "Europa",
              "Ásia",
              "América do Sul"
            ],
            "correct": "América do Sul",
            "explanation": "Maior país do subcontinente sul-americano.",
            "difficulty": "Fácil",
            "id": 960933
          },
          {
            "type": "choice",
            "question": "Quando no Brasil é Dia, no Japão (Hemisfério Oposto) é:",
            "options": [
              "Dia também",
              "Noite",
              "Nascer do sol"
            ],
            "correct": "Noite",
            "explanation": "Eles estão do outro lado do mundo.",
            "difficulty": "Moderado",
            "id": 960934
          },
          {
            "type": "choice",
            "question": "Cartografia é o estudo e confecção de:",
            "options": [
              "Plantas e animais",
              "Planetas",
              "Mapas"
            ],
            "correct": "Mapas",
            "explanation": "A ciência de produzir representações geográficas.",
            "difficulty": "Difícil",
            "id": 960935
          }
        ]
      }
    }
  }
};

export const periodDatabases: Record<string, Record<string, Subject>> = {
  "p1": questionDatabase,
  "p2": questionDatabase,
  "p3": questionDatabase,
  "p4": questionDatabase,
  "p5": questionDatabase,
  "p6": questionDatabase,
  "p7": questionDatabase,
  "p8": questionDatabase,
  "p9": questionDatabase
};
