import { SetMetadata } from '@nestjs/common'
import { isPublicRoute } from '@constants/common'

export const PublicRoute = () => SetMetadata(isPublicRoute, true)
