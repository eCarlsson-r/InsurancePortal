import customer from './customer'
import agent from './agent'
import program from './program'
import product from './product'
import fund from './fund'
import agency from './agency'
import contest from './contest'

const master = {
    customer: Object.assign(customer, customer),
    agent: Object.assign(agent, agent),
    program: Object.assign(program, program),
    product: Object.assign(product, product),
    fund: Object.assign(fund, fund),
    agency: Object.assign(agency, agency),
    contest: Object.assign(contest, contest),
}

export default master