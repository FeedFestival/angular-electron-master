import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ElectronService } from '../core/services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  fs: any;
  robot: any;

  constructor(
    private router: Router,
    private electronService: ElectronService) { }

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
  }

}
