"use strict";(self.webpackChunknoteadder=self.webpackChunknoteadder||[]).push([[649],{288:(e,t,n)=>{var r=n(592);window.addEventListener("resize",d),document.addEventListener("DOMContentLoaded",d),timeSigs.forEach((e=>{e.addEventListener("click",d)})),window.addEventListener("dragend",d),window.addEventListener("touchend",d);const o=r.Z.Flow;let a=document.getElementById("notation-container");function d(){let e=document.getElementById("notation-container");e.firstChild.remove();let t=new o.Renderer(e,o.Renderer.Backends.SVG),n=e.offsetWidth;t.resize(n,100);const r=t.getContext(),a=new o.Stave(0,0,n);let d=document.querySelector(".time-signature.pressed").getAttribute("signature");a.addClef("percussion").addTimeSignature(d,10),a.setContext(r).draw();let s=document.querySelectorAll(".placed"),l=[];s.forEach((e=>{let t=e.getAttribute("vf-duration"),n=e.getAttribute("dotted"),r=new o.StaveNote({clef:"percussion",keys:["c/5"],duration:t});r.setStyle({fillStyle:e.getAttribute("note-color"),strokeStyle:"black"}),r.setFlagStyle({fillStyle:"black",strokeStyle:"black"}),"true"===n&&r.addDotToAll(),l.push(r)}));let i=o.Beam.generateBeams(l);"6/8"===d&&(i=o.Beam.generateBeams(l,{groups:[new o.Fraction(3,8)]}));const c=new o.Voice({num_beats:4,beat_value:4}).setStrict(!1);c.addTickables(l);let u=a.getNoteStartX();(new o.Formatter).joinVoices([c]).format([c],n-u),c.draw(r,a),i.forEach((e=>{e.setContext(r).draw()})),document.querySelectorAll(".vf-notehead>path").forEach((e=>{e.setAttribute("stroke","black")}))}new o.Renderer(a,o.Renderer.Backends.SVG)}},e=>{e(e.s=288)}]);