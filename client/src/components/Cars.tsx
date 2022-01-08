import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createCar,  deleteCar, getCars, patchCar } from '../api/cars-api'
import Auth from '../auth/Auth'
import { Car } from '../types/Car'

interface CarsProps {
  auth: Auth
  history: History
}

interface CarsState {
  cars: Car[]
  newCarMaker: string,
  newCarModel: string,
  newCarYear: string,
  loadingCars: boolean
}

export class Cars extends React.PureComponent<CarsProps, CarsState> {
  state: CarsState = {
    cars: [],
    newCarMaker: '',
    newCarModel: '',
    newCarYear: '',
    loadingCars: true
  }

  handleMakerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCarMaker: event.target.value })
  }

  handleModelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCarModel: event.target.value })
  }

  handleYearChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newCarYear: event.target.value })
  }

  onEditButtonClick = (carId: string) => {
    this.props.history.push(`/cars/${carId}/edit`)
  }

  onCarCreate = async (event: React.ChangeEvent<HTMLButtonElement>) => {
    if (!this.state.newCarMaker || !this.state.newCarModel || !this.state.newCarYear) {
      alert('All fields are mandatory')
      return
    }
    try {
      //const dueDate = this.calculateDueDate()
      const newCar = await createCar(this.props.auth.getIdToken(), {
        maker: this.state.newCarMaker,
        model: this.state.newCarModel,
        year: this.state.newCarYear
      })
      this.setState({
        cars: [...this.state.cars, newCar],
        newCarMaker: '',
        newCarModel: '',
        newCarYear: '',
      })
    } catch {
      alert('Car creation failed')
    }
  }

  onCarDelete = async (carId: string) => {
    try {
      await deleteCar(this.props.auth.getIdToken(), carId)
      this.setState({
        cars: this.state.cars.filter(car => car.carId !== carId)
      })
    } catch {
      alert('Car deletion failed')
    }
  }

  onCarCheck = async (pos: number) => {
    try {
      const car = this.state.cars[pos]
      await patchCar(this.props.auth.getIdToken(), car.carId, {
        purchased: !car.purchased
      })
      this.setState({
        cars: update(this.state.cars, {
          [pos]: { purchased: { $set: !car.purchased } }
        })
      })
    } catch {
      alert('Car update failed')
    }
  }

  async componentDidMount() {
    try {
      const cars = await getCars(this.props.auth.getIdToken())
      this.setState({
        cars,
        loadingCars: false
      })
    } catch (e: any) {
      alert(`Failed to fetch Cars: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Car Collection</Header>

        {this.renderCreateCarInput()}

        {this.renderCars()}
      </div>
    )
  }

  renderCreateCarInput() {
    return (
      <Grid.Row>
        <Grid.Column width={8}>
          <Input
            action={{
              color: 'teal',
              labelPosition: 'left',
              icon: 'add',
              content: 'Add car',
              onClick: this.onCarCreate
            }}
            // fluid
            actionPosition="left"
            value={this.state.newCarMaker}
            placeholder="Maker"
            required
            onChange={this.handleMakerChange}
          />
          <Input
            placeholder="Model"
            value={this.state.newCarModel}
            onChange={this.handleModelChange}
            required
            style={{
              'height': '40px',
              marginLeft: "8px"
            }}
          />
          <Input
            placeholder="Year"
            value={this.state.newCarYear}
            onChange={this.handleYearChange}
            required
            style={{
              'height': '40px',
              marginLeft: "8px"
            }}
          />
        </Grid.Column>

        <Grid.Column width={16}>
          <Divider />
        </Grid.Column>
      </Grid.Row>
    )
  }

  renderCars() {
    if (this.state.loadingCars) {
      return this.renderLoading()
    }

    return this.renderCarsList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Car Collection
        </Loader>
      </Grid.Row>
    )
  }

  renderCarsList() {
    return (
      <Grid padded>
        {this.state.cars.map((car, pos) => {
          return (
            <Grid.Row key={car.carId}>
              <Grid.Column width={1} verticalAlign="middle">
                <Checkbox
                  onChange={() => this.onCarCheck(pos)}
                  checked={car.purchased}
                />
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {car.maker}
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {car.model}
              </Grid.Column>
              <Grid.Column width={3} verticalAlign="middle">
                {car.year}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(car.carId)}
                >
                  <Icon name="pencil" />
                </Button>
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="red"
                  onClick={() => this.onCarDelete(car.carId)}
                >
                  <Icon name="delete" />
                </Button>
              </Grid.Column>
              {car.attachmentUrl && (
                <Image src={car.attachmentUrl} size="small" wrapped />
              )}
              <Grid.Column width={12}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  calculateDueDate(): string {
    const date = new Date()
    date.setDate(date.getDate() + 7)

    return dateFormat(date, 'yyyy-mm-dd') as string
  }
}
