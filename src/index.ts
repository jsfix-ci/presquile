#!/usr/bin/env node
import { apply } from './drivers/auditionCVS/applier'
import {Command} from 'commander'
import { flow } from 'fp-ts/lib/function'
import { fold } from 'fp-ts/lib/Either'

const program = new Command()
program.version('1.0.0')

/* TODO: JSFIX could not patch the breaking change:
[Deprecated] second parameter of cmd.description(desc, argDescriptions) for adding argument descriptions  
Suggested fix: Passing a second argument to description is deprecated after 8.0.0. We suggest using the argument API (for example, new ...description('test command').argument(name, description)), which is meant for declaring program arguments instead. */
program.command('apply <auditionCVS> <mp3File>')
    .description('test command', {
        auditionCVS: 'Audition CVS Markers file',
        mp3File: 'Mp3 file'
    })
    .action(async (auditionCVS, mp3File) => {
        const r = await apply(auditionCVS, mp3File)()

        flow(
            fold(
                (e:Error) => console.error('Error: %s', e.message),
                () => console.log('Chapters written inside mp3!') 
            )
        )(r)
    })

program.parse(process.argv)
