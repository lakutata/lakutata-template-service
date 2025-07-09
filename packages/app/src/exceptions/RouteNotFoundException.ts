import {Exception} from 'lakutata'

export class RouteNotFoundException extends Exception {
    errno: string | number = 'E_ROUTE_NOT_FOUND'
}