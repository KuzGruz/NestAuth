import {CacheModule, Module} from '@nestjs/common'
import * as redisStore from 'cache-manager-redis-store'
import {ConfigModule, ConfigService} from '@nestjs/config'

const redisCacheModule = CacheModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (config: ConfigService) => ({
        store: redisStore,
        socket: {
            host: config.get('REDIS_HOST'),
            port: config.get('REDIS_PORT')
        }
    })
})

@Module({
    imports: [redisCacheModule],
    exports: [redisCacheModule]
})
export class CacheManagerModule {
}
