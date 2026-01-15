import CustomerController from './CustomerController'
import AgentController from './AgentController'
import ProgramController from './ProgramController'
import ProductController from './ProductController'
import FundController from './FundController'
import AgencyController from './AgencyController'
import ContestController from './ContestController'
import PolicyController from './PolicyController'
import ReceiptController from './ReceiptController'

const Controllers = {
    CustomerController: Object.assign(CustomerController, CustomerController),
    AgentController: Object.assign(AgentController, AgentController),
    ProgramController: Object.assign(ProgramController, ProgramController),
    ProductController: Object.assign(ProductController, ProductController),
    FundController: Object.assign(FundController, FundController),
    AgencyController: Object.assign(AgencyController, AgencyController),
    ContestController: Object.assign(ContestController, ContestController),
    PolicyController: Object.assign(PolicyController, PolicyController),
    ReceiptController: Object.assign(ReceiptController, ReceiptController),
}

export default Controllers