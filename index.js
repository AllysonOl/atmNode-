// modulos 
import chalk from "chalk"
import fs from "fs"
import inquirer from "inquirer"

operation()


function operation() {

  inquirer.prompt([{
    type: 'list',
    name: 'action',
    message: 'O que você deseja fazer?',
    choices: ['Criar conta', 'Consultar Saldo', 'Depositar','Sacar','Sair']
  }
]).then((answer) => {

  const action = answer['action']
  if( action === 'Criar conta') {
    createAccount()
  } else if (action === 'Depositar'){
    deposit()

  } else if(action === 'Consultar Saldo') {

    getAccountBalance()

  } else if(action === 'Sacar') {
    widthdraw()

  } else if(action === 'Sair') {
     console.log(chalk.bgBlue.black('Obrigado por usar o Account!')) 
     process.exit()
  }
})
  .catch((err) => console.log(err))
}


//criando conta
function createAccount() {
console.log(chalk.bgGreen.black('Parabéns por escolher o nosso banco!'))
console.log(chalk.green('Defina as opções da sua conta a seguir'))

buildAccount()
}

function buildAccount() {

  inquirer
    .prompt([{
      name: 'accountName',
      message: 'Escolha um nome para sua conta:'
    },
  ])
  .then((answer) => {
    const accountName = answer['accountName']
    console.info(accountName)

    if(!fs.existsSync('accounts')) {
      fs.mkdirSync('accounts')
    }

    if(fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Conta já cadastrada no sistema, por favor escolha outro nome!'))
    buildAccount()
    return
  }

    

    fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function (err) {
      console.log(err)
    })

      console.log(chalk.green('Parabéns a sua conta foi criada!'))
      operation()
  })
  .catch((err) => console.log(err))

}

function deposit(){

  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Qual o nome da sua conta?'
    }
  ])
    .then((answer) => {
      const accountName = answer['accountName']


//verificação de conta existente
        if(!checkAccount(accountName)) {
            return deposit()
        }

        inquirer.prompt([
          { 
          name: 'amount',
          message: 'Quanto você deseja depositar'
          }
        ])
        .then((answer) => {

          const amount = answer['amount']

          //Depositando
          addAmount(accountName, amount)
          operation()

        })
        .catch((err) => console.log(err))

    })
    .catch((err) => console.log(err))
}

function checkAccount(accountName) {
  if(!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black('Tente novamente'))
    return false
  }
  return true
}

function addAmount(accountName, amount) {

    const accountData = getAccount(accountName)

  if(!amount) {
    console.log(chalk.bgRed.black('Falha! Tente novamente!'))
    return deposit()
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)
  
  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function (err) {
      console.log(err)
    }
  )
    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`))
  
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: 'utf8',
    flag: 'r'
  })

  return JSON.parse(accountJSON)
}

function getAccountBalance() {
  inquirer
  .prompt([
    {
      name: 'accountName',
      message: 'Qual o nome da sua conta?'
    }
  ]).then((answer) => {

    const accountName = answer["accountName"]

    if(!checkAccount(accountName)) {
      return getAccountBalance()
    }

    const accountData = getAccount(accountName)

    console.log(chalk.bgBlue.black(`Saldo atual da sua conta é de: R$${accountData.balance}`))

    operation()

  }).catch(err => console.log(err))
}

function widthdraw() {
 
  inquirer.prompt([
    {
      name: 'accountName',
      message: 'Qual o nome da sua conta?'
    }
  ])
  .then((answer) => {

    const accountName = answer['accountName']

    if(!checkAccount(accountName)) {
      return widthdraw()
    }

    inquirer.prompt([{
      name: 'amount',
      message: 'Qual valor você deseja retirar?'
    }])
    .then((answer) => {

    const amount = answer['amount']

    removeAmount(accountName, amount)    

    })
    .catch((err) => console.log(err))


  })
  .catch((err) => console.log(err))

}

function removeAmount(accountName, amount) {

  const accountData = getAccount(accountName)

  if(!amount) {
    
    console.log(chalk.bgRed.black('Falha! Tente novamente!'))
    return widthdraw()
  }

  if(accountData.balance < amount) {
    console.log(chalk.bgRed.black('Valor indisponível!'))
    return widthdraw()
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    function(err) {
      console.log(err)
    }
  )

  console.log(chalk.green(`Foi realizado um saque de RS${amount} da sua conta!`))
  operation()

}