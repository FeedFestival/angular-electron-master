import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Tween from '@tweenjs/tween.js';
import { ElectronService as NgxElectronService } from 'ngx-electron';
import { ElectronService } from '../core/services';
import { Coord } from '../models/coord';
import { IFS } from '../models/fs';
import { IRobot } from '../models/robot';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  fs: IFS;
  robot: IRobot;
  tNamespace: any;

  constructor(
    private router: Router,
    private electronService: ElectronService,
    private ngxElectronService: NgxElectronService
    ) {
      console.log('Started');
    }

  ngOnInit() {
    this.fs = this.electronService.remote.require('fs');
    this.robot = this.electronService.remote.require('robotjs');
    /*
    If this erros out. Steps:
    -> npm i -D electron-rebuild
    -> ./node_modules/.bin/electron-rebuild

    // You can try:

      -> npx electron-rebuild -f -t prod,optional,dev -w robotjs
      -> npx electron-rebuild -f -m node_modules/robotjs

    // Other things that can work:
      -> npm i robotjs
      -> npm i -D electron-rebuild
      -> npm install -g node-gyp
      -> npx electron-rebuild -f -t prod,optional,dev -w robotjs
    */
    const tween = (Tween as any);
    this.tNamespace = tween.default;

    // Setup the animation loop.
    const animate = (time) => {
      requestAnimationFrame(animate);
      this.tNamespace.update(time);
    }
    requestAnimationFrame(animate);
  }

  openPic() {
    const mainPath = 'D:\\Downloads\\';
    const path = mainPath + 'Pics 10_2_2016\\storm_chaser_by_kypcaht-d5flwfq.jpg';
    this.ngxElectronService.shell.openItem(path);
  }

  moveMouseAction() {
    setTimeout(_ => {

      const coord1 = { x: 1210, y: 1060, t: 0.5 };
      this.moveMouse(coord1, _ => {

        const coord2 = { x: 1905, y: 10, t: 0.5 };
        this.moveMouse(coord2, _ => {

          this.robot.mouseClick();

        });
      });
    }, 1000);
  }

  private moveMouse(newPos: Coord, callback = null) {
    var mouse = {
      x: this.robot.getMousePos().x,
      y: this.robot.getMousePos().y
    }
    console.log("HomePageComponent -> moveMouse -> mouse", mouse);

    let newTween = new this.tNamespace.Tween(mouse)
      .to({ x: newPos.x, y: newPos.y }, newPos.t * 1000)
      .onUpdate(change => {
        this.robot.moveMouse(change.x, change.y);
      })
      .start();
    newTween.onComplete(_ => {
      if (callback) {
        callback();
      }
    });
  }

  doNothing() {

    // const net = new (recurrent as any).LSTM();
    // console.log("HomePageComponent -> doNothing -> net", net)

    // const trainingData = [
    // 	{ "input": "cat", "output": 'animal' },
    // 	{ "input": "dog", "output": 'animal' },
    // 	{ "input": "zebra", "output": 'animal' },
    // 	{ "input": "tiger", "output": 'animal' },
    // 	{ "input": "kangaroo", "output": 'animal' },
    // 	{ "input": "lizard", "output": 'animal' },
    // 	{ "input": "chimpanzee", "output": 'animal' },

    // 	{ "input": "house", "output": 'thing' },
    // 	{ "input": "me", "output": 'thing' },
    // 	{ "input": "you", "output": 'thing' },
    // 	{ "input": "table", "output": 'thing' },
    // 	{ "input": "farm", "output": 'thing' },
    // 	{ "input": "hook", "output": 'thing' },
    // 	{ "input": "chance", "output": 'thing' },
    // ];

    // net.train(trainingData, {});

    // const output = net.run("heaven");
    // console.log(output);
  }

}
