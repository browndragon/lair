import Phaser from 'phaser';
import Machine from '@browndragon/sm';

const game = new Phaser.Game({
    // type: Phaser.AUTO,
    // parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '222222',
    render: {
        pixelArt: true,
    },
    scene: class extends Phaser.Scene {
        create() {
            this.log = this.add.text(16, 16, 'Logs:', {wordWrap: { width: 584, useAdvancedWrap: true }});
            this.options = this.add.text(616, 16, 'Opts:', {wordWrap: { width: 184, useAdvancedWrap: true }});
            let machine = new Machine(function() {
                this.log('you are robin good luck');
                return Places.batcave;
            });
            this.machine = machine;
            machine.logs = [];
            machine.options = {};
            machine.log = (...params) => { console.log('+log:', ...params); machine.logs.push(params); };
            machine.option = (fn) => {console.log('+option:', fn.name); machine.options[fn.name] = fn; };
            machine.mobs = new Map();
            machine.getPlace = (mob) => machine.mobs.get(mob);
            machine.move = (mob, place) => machine.mobs.set(mob, place);
            machine.mobs.set(Mobs.alfred, Places.batcave);
            machine.mobs.set(Mobs.bruce, Places.batcave);
            machine.mobs.set(Mobs.catwoman, Places.city);
            const scene = this;
            machine.pre = function(verb) {
                machine.logs = [];
                machine.options = {};
                scene.log.text = '...running';
                scene.options.text = '...running';
                this.log('-------PRE');
                let action = this.options && this.options[verb];
                if (action) {
                    return action;
                }
            };
            machine.rewrite = function(stage) {
                return function(verb) {
                    let result = stage.call(this, verb);
                    for (let [k, v] of this.mobs) {
                        if (stage == v) {
                            // If they're here, print their message "inline".
                            k.call(this, verb);
                        }
                    }
                    scene.log.setText(this.logs);
                    scene.options.setText(Object.keys(this.options).map((s, i) => `option ${i}: ${s}`));
                };
            };
            this.runs = 0;
            debugger;
        }
        update() {
            this.runs += 1;
        }
    },
});

const Places = {
    arkham(verb) {
        this.log('arkham is crazy.');
        this.option(function city() {
            this.log('you drive back to the city');
            return Places.city;
        });
    },
    batcave(verb) {
        this.log('batcave is dark.');
        this.option(Places.city);
    },
    city(verb) {
        this.log('city is full of crime.');
        if (this.getPlace(Mobs.bruce) != this.current) {
            this.option(function batsignal() {
                this.log('nanananana batman!');
                this.move(Mobs.bruce, Places.city);
                return Places.city;
            });
        }
        this.option(function arkham() {
            this.log('arkham is dark and spooky on the horizon');
            return Places.arkham;
        })
        this.option(function batcave() {
            this.log('Which way?');
            this.option(function waterfall() {
                this.log('you drive through the secret door in the waterfall');
                return Places.batcave;
            });
            this.option(function mansion() {
                this.log('you go in through the mansion, recalling alfred');
                return Places.batcave;
            });
        })
    },
};
const Mobs = {
    alfred(verb) {
        this.log('alfred is making tea');
        if (this.current == Places.city) {
            this.option(function kickAlf() {
                this.log('im leaving :(');
                this.move(Mobs.alfred, Places.batcave);
            });
        } else {
            this.option(function kissAlf() {
                this.log('alfred says oh my and drives you to the city');
                this.move(Mobs.alfred, Places.city);
                return Places.city;                
            });
        }
        const brucePlace = this.getPlace(Mobs.bruce);
        if (brucePlace != this.current) {
            this.option(function kickAlf() {
                this.log('oh sir behave; im leaving');
                this.move(Mobs.alfred, brucePlace);
            });
        }
    },
    bruce(verb) {
        if (this.current == Places.batcave) {
            this.log('batman is here');
            this.option(function kickBat() {
                this.log('this has no effect');
            });
            this.option(function kissBat() {
                this.log('batman doesnt like that :( ur in jail');
                return Places.arkham;
            });
        } else {
            this.log('millionaire playboy bruce wayne is here');
            this.option(function kissBruce() {
                this.log('uh no thanks');
                this.move(Mobs.bruce, Places.batcave);
            });
        }
    },
    catwoman(verb) {
        this.log('meowing fills the air');
        if (this.current == Places.arkham) {
            this.log('catwoman is in jail');
            this.option(function kickCat() { 
                this.log('mean :(');
            });
            this.option(function release() {
                let after = this.prev;
                this.log('do you mean it?');
                this.option(function yes() {
                    this.log('sweet kthxbai');
                    this.move(Mobs.catwoman, Places.city);
                    return after;
                });
                this.option(function no() {
                    this.log('mean :(');
                    return after;
                });
            })
        } else {
            this.log('catwoman is prowling');
            this.option(function kickCat() {
                this.move(Mobs.catwoman, this.current == Places.city ? Places.batcave : Places.arkham);
            })
        }
    },
};

