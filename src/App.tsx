import './styles/global.css'

import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'

const createUserFormSchema = z.object({ //criação do schema de validação utilizado pelo zod
  name: z.string()
  .min(1,{message: "O nome é obrigatório"})
  // .transform(name => name.toUpperCase()),
  .transform(name => {
      return name.trim().split(' ').map(word => {
        return word[0].toLocaleUpperCase().concat(word.substring(1))
      }).join(' ')
      //trim remove os espaços em branco no inicio e no final do campo
      //split divide a string nome em um array de palavras usando o espaço em branco como separador
      //itera sobre cada palavra no array criado no split e executa a função de callback
      //função de callback deixa a primeira letra de cada palavra maiúscula
      //.concat concatena a letra maiúscula com o restante da string minuscula
      //join junta os elementros do array em somente uma unica string
  }),
  email: z.string() //define como string
    .min(1, {message: "Preenchimento do e-mail é obrigatório"}) //preenchimento obrigatório
    .email('Formato de e-mail inválido')
    .refine(email => {
      return email.endsWith('@windel.com.br')
    }, 'O e-mail dever ser da Windel Sistemas'),
  password: z.string()
    .min(6, 'A senha precisa de no mínimo 6 caracteres'),
  techs: z.array(z.object({
    title: z.string().min(1,{message: "o Título é obrigatório"}),
    knowledge: z.coerce.number().min(1).max(100), //coerce transforma o input em numero.
  })).min(2, 'Insira pelo menos duas tecnologias')
})

type CreateUserFormData = z.infer<typeof createUserFormSchema> //tipos para a validação correta dos formulário. Passaremos o CreateUserFormData na chamada do useForm para o resolver

export function App() {

  const { 
    register, 
    handleSubmit, 
    formState: {errors},
    control
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema)
  })
  
  //register: conecta os campos do formulário ao React Hook Form, permitindo que ele gerencie os valores e as validações. É usado diretamente no input com {...register('nameDoCampo')}.
  //handlesubmit: lida com a submissão do formulário, executando uma função que você define para processar os dados. É usado no elemento <form> com onSubmit={handleSubmit(suaFuncao)}.
  //formstate: fornece informações sobre o estado do formulário, como erros de validação (formState.errors), status de submissão (formState.isSubmitting), etc. Use-o para exibir mensagens de erro, desabilitar botões e controlar o comportamento do formulário.

  // console.log(errors) // retorna os erros no console

  const { fields, append, remove} = useFieldArray({
    control,
    name: 'techs',
  })

  function addNewTech(){
    append({ title: '', knowledge: 0})
  }

  function createUser(data: any){
    console.log(data) //retorna os valores do formulario
  }

  return (
    <main className='h-screen bg-zinc-950 text-zinc-300 flex items-center justify-center'>
      <form onSubmit={handleSubmit(createUser)} action="" className='flex flex-col gap-4 w-full max-w-xs'>
      <div className='flex flex-col gap-1'>
          <label htmlFor="">name</label>
          <input 
            type="text" 
            className='border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white'
            {...register('name')} //quando definido aqui, não precisamos informar o atributo name para o input
          />
          {errors.name && <span className='text-red-500'>{errors.name.message}</span>}
        </div>
        <div className='flex flex-col gap-1'>
          <label htmlFor="">E-mail</label>
          <input 
            type="email" 
            className='border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white'
            {...register('email')} //quando definido aqui, não precisamos informar o atributo name para o input
          />
          {errors.email && <span className='text-red-500'>{errors.email.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
          <label htmlFor="">Senha</label>
          <input 
            type="password" 
            className='border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white'
            {...register('password')}
          />
          {errors.password && <span className='text-red-500'>{errors.password.message}</span>}
        </div>

        <div className='flex flex-col gap-1'>
            <label htmlFor="">
              Tecnologia
              <button className='text-emerald-500 text-xs' onClick={addNewTech}>Adicionar</button>
            </label>
          
          {fields.map((field, index) => {
            return(
              <div className='flex gap-2' key={field.id}>
                <input 
                  type="text"
                  className='border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white flex-1'
                  {...register(`techs.${index}.title`)}
                />
                {errors.techs?.[index]?.title && <span className='text-red-500'>{errors.techs?.[index]?.title?.message}</span>}
                <input 
                  type="number" 
                  className='w-16 border border-zinc-600 shadow-sm rounded h-10 px-3 bg-zinc-900 text-white flex-1'
                  {...register(`techs.${index}.knowledge`)}
                />
                {errors.techs?.[index]?.knowledge && <span className='text-red-500'>{errors.techs?.[index]?.knowledge?.message}</span>}
              </div>
            )
          })}
          {errors.techs && <span className='text-red-500'>{errors.techs.message}</span>}
        </div>

        <button 
          type='submit'
          className='bg-emerald-500 rounded font-semibold text-white h-10 hover:bg-emerald-600'
        >
          Salvar
        </button>
      </form>
    </main>
  )
}

export default App
