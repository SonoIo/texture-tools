#!/usr/bin/env node

//
// Graphic Magick
// Docs: https://aheckmann.github.io/gm/docs.html
//

const { Command } = require('commander');
const path = require('path');
const gm = require('gm');

const program = new Command();
program.version('1.0.0');

// Create opacity mask
program
    .command('mask <source> [destination]')
    .description('Create opacity mask from RGB file using a color as transparency')
    .option('-c, --color <hex>', 'transparent color, default #000000', '#000000')
    .option('-t, --tolerance <tolerance>', 'color tolerance, default 10%', 10)
    .action((source, destination, options) => {
        const ext = path.extname(source);
        if (destination == null) {
            destination = path.basename(source, ext) + '_mask' + ext;
        }
        const absoluteSource = path.join(process.env.PWD, source);
        const absoluteDestination = path.join(process.env.PWD, destination);
        gm(absoluteSource)
            .fuzz(options.tolerance, true)
            .transparent(options.color)
            .channel('opacity')
            .negative()
            .write(absoluteDestination, (err) => {
                if (err) return handleError(err);
                console.log('Opacity mask created: ', destination);
            });
    });

program.parse(process.argv);

function handleError(err) {
    console.error(err);
}