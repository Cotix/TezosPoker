/**
* @class SRACryptoWorker Asynchronous Web Worker implementation of the SRA cryptosystem.
* @name SRACryptoWorker
* @version 0.2.0
*/
var bigInt=function(undefined){"use strict";var BASE=1e7,LOG_BASE=7,MAX_INT=9007199254740992,MAX_INT_ARR=smallToArray(MAX_INT),LOG_MAX_INT=Math.log(MAX_INT);function Integer(v,radix){if(typeof v==="undefined")return Integer[0];if(typeof radix!=="undefined")return+radix===10?parseValue(v):parseBase(v,radix);return parseValue(v)}function BigInteger(value,sign){this.value=value;this.sign=sign;this.isSmall=false}BigInteger.prototype=Object.create(Integer.prototype);function SmallInteger(value){this.value=value;this.sign=value<0;this.isSmall=true}SmallInteger.prototype=Object.create(Integer.prototype);function isPrecise(n){return-MAX_INT<n&&n<MAX_INT}function smallToArray(n){if(n<1e7)return[n];if(n<1e14)return[n%1e7,Math.floor(n/1e7)];return[n%1e7,Math.floor(n/1e7)%1e7,Math.floor(n/1e14)]}function arrayToSmall(arr){trim(arr);var length=arr.length;if(length<4&&compareAbs(arr,MAX_INT_ARR)<0){switch(length){case 0:return 0;case 1:return arr[0];case 2:return arr[0]+arr[1]*BASE;default:return arr[0]+(arr[1]+arr[2]*BASE)*BASE}}return arr}function trim(v){var i=v.length;while(v[--i]===0);v.length=i+1}function createArray(length){var x=new Array(length);var i=-1;while(++i<length){x[i]=0}return x}function truncate(n){if(n>0)return Math.floor(n);return Math.ceil(n)}function add(a,b){var l_a=a.length,l_b=b.length,r=new Array(l_a),carry=0,base=BASE,sum,i;for(i=0;i<l_b;i++){sum=a[i]+b[i]+carry;carry=sum>=base?1:0;r[i]=sum-carry*base}while(i<l_a){sum=a[i]+carry;carry=sum===base?1:0;r[i++]=sum-carry*base}if(carry>0)r.push(carry);return r}function addAny(a,b){if(a.length>=b.length)return add(a,b);return add(b,a)}function addSmall(a,carry){var l=a.length,r=new Array(l),base=BASE,sum,i;for(i=0;i<l;i++){sum=a[i]-base+carry;carry=Math.floor(sum/base);r[i]=sum-carry*base;carry+=1}while(carry>0){r[i++]=carry%base;carry=Math.floor(carry/base)}return r}BigInteger.prototype.add=function(v){var n=parseValue(v);if(this.sign!==n.sign){return this.subtract(n.negate())}var a=this.value,b=n.value;if(n.isSmall){return new BigInteger(addSmall(a,Math.abs(b)),this.sign)}return new BigInteger(addAny(a,b),this.sign)};BigInteger.prototype.plus=BigInteger.prototype.add;SmallInteger.prototype.add=function(v){var n=parseValue(v);var a=this.value;if(a<0!==n.sign){return this.subtract(n.negate())}var b=n.value;if(n.isSmall){if(isPrecise(a+b))return new SmallInteger(a+b);b=smallToArray(Math.abs(b))}return new BigInteger(addSmall(b,Math.abs(a)),a<0)};SmallInteger.prototype.plus=SmallInteger.prototype.add;function subtract(a,b){var a_l=a.length,b_l=b.length,r=new Array(a_l),borrow=0,base=BASE,i,difference;for(i=0;i<b_l;i++){difference=a[i]-borrow-b[i];if(difference<0){difference+=base;borrow=1}else borrow=0;r[i]=difference}for(i=b_l;i<a_l;i++){difference=a[i]-borrow;if(difference<0)difference+=base;else{r[i++]=difference;break}r[i]=difference}for(;i<a_l;i++){r[i]=a[i]}trim(r);return r}function subtractAny(a,b,sign){var value;if(compareAbs(a,b)>=0){value=subtract(a,b)}else{value=subtract(b,a);sign=!sign}value=arrayToSmall(value);if(typeof value==="number"){if(sign)value=-value;return new SmallInteger(value)}return new BigInteger(value,sign)}function subtractSmall(a,b,sign){var l=a.length,r=new Array(l),carry=-b,base=BASE,i,difference;for(i=0;i<l;i++){difference=a[i]+carry;carry=Math.floor(difference/base);difference%=base;r[i]=difference<0?difference+base:difference}r=arrayToSmall(r);if(typeof r==="number"){if(sign)r=-r;return new SmallInteger(r)}return new BigInteger(r,sign)}BigInteger.prototype.subtract=function(v){var n=parseValue(v);if(this.sign!==n.sign){return this.add(n.negate())}var a=this.value,b=n.value;if(n.isSmall)return subtractSmall(a,Math.abs(b),this.sign);return subtractAny(a,b,this.sign)};BigInteger.prototype.minus=BigInteger.prototype.subtract;SmallInteger.prototype.subtract=function(v){var n=parseValue(v);var a=this.value;if(a<0!==n.sign){return this.add(n.negate())}var b=n.value;if(n.isSmall){return new SmallInteger(a-b)}return subtractSmall(b,Math.abs(a),a>=0)};SmallInteger.prototype.minus=SmallInteger.prototype.subtract;BigInteger.prototype.negate=function(){return new BigInteger(this.value,!this.sign)};SmallInteger.prototype.negate=function(){var sign=this.sign;var small=new SmallInteger(-this.value);small.sign=!sign;return small};BigInteger.prototype.abs=function(){return new BigInteger(this.value,false)};SmallInteger.prototype.abs=function(){return new SmallInteger(Math.abs(this.value))};function multiplyLong(a,b){var a_l=a.length,b_l=b.length,l=a_l+b_l,r=createArray(l),base=BASE,product,carry,i,a_i,b_j;for(i=0;i<a_l;++i){a_i=a[i];for(var j=0;j<b_l;++j){b_j=b[j];product=a_i*b_j+r[i+j];carry=Math.floor(product/base);r[i+j]=product-carry*base;r[i+j+1]+=carry}}trim(r);return r}function multiplySmall(a,b){var l=a.length,r=new Array(l),base=BASE,carry=0,product,i;for(i=0;i<l;i++){product=a[i]*b+carry;carry=Math.floor(product/base);r[i]=product-carry*base}while(carry>0){r[i++]=carry%base;carry=Math.floor(carry/base)}return r}function shiftLeft(x,n){var r=[];while(n-- >0)r.push(0);return r.concat(x)}function multiplyKaratsuba(x,y){var n=Math.max(x.length,y.length);if(n<=30)return multiplyLong(x,y);n=Math.ceil(n/2);var b=x.slice(n),a=x.slice(0,n),d=y.slice(n),c=y.slice(0,n);var ac=multiplyKaratsuba(a,c),bd=multiplyKaratsuba(b,d),abcd=multiplyKaratsuba(addAny(a,b),addAny(c,d));var product=addAny(addAny(ac,shiftLeft(subtract(subtract(abcd,ac),bd),n)),shiftLeft(bd,2*n));trim(product);return product}function useKaratsuba(l1,l2){return-.012*l1-.012*l2+15e-6*l1*l2>0}BigInteger.prototype.multiply=function(v){var n=parseValue(v),a=this.value,b=n.value,sign=this.sign!==n.sign,abs;if(n.isSmall){if(b===0)return Integer[0];if(b===1)return this;if(b===-1)return this.negate();abs=Math.abs(b);if(abs<BASE){return new BigInteger(multiplySmall(a,abs),sign)}b=smallToArray(abs)}if(useKaratsuba(a.length,b.length))return new BigInteger(multiplyKaratsuba(a,b),sign);return new BigInteger(multiplyLong(a,b),sign)};BigInteger.prototype.times=BigInteger.prototype.multiply;function multiplySmallAndArray(a,b,sign){if(a<BASE){return new BigInteger(multiplySmall(b,a),sign)}return new BigInteger(multiplyLong(b,smallToArray(a)),sign)}SmallInteger.prototype._multiplyBySmall=function(a){if(isPrecise(a.value*this.value)){return new SmallInteger(a.value*this.value)}return multiplySmallAndArray(Math.abs(a.value),smallToArray(Math.abs(this.value)),this.sign!==a.sign)};BigInteger.prototype._multiplyBySmall=function(a){if(a.value===0)return Integer[0];if(a.value===1)return this;if(a.value===-1)return this.negate();return multiplySmallAndArray(Math.abs(a.value),this.value,this.sign!==a.sign)};SmallInteger.prototype.multiply=function(v){return parseValue(v)._multiplyBySmall(this)};SmallInteger.prototype.times=SmallInteger.prototype.multiply;function square(a){var l=a.length,r=createArray(l+l),base=BASE,product,carry,i,a_i,a_j;for(i=0;i<l;i++){a_i=a[i];for(var j=0;j<l;j++){a_j=a[j];product=a_i*a_j+r[i+j];carry=Math.floor(product/base);r[i+j]=product-carry*base;r[i+j+1]+=carry}}trim(r);return r}BigInteger.prototype.square=function(){return new BigInteger(square(this.value),false)};SmallInteger.prototype.square=function(){var value=this.value*this.value;if(isPrecise(value))return new SmallInteger(value);return new BigInteger(square(smallToArray(Math.abs(this.value))),false)};function divMod1(a,b){var a_l=a.length,b_l=b.length,base=BASE,result=createArray(b.length),divisorMostSignificantDigit=b[b_l-1],lambda=Math.ceil(base/(2*divisorMostSignificantDigit)),remainder=multiplySmall(a,lambda),divisor=multiplySmall(b,lambda),quotientDigit,shift,carry,borrow,i,l,q;if(remainder.length<=a_l)remainder.push(0);divisor.push(0);divisorMostSignificantDigit=divisor[b_l-1];for(shift=a_l-b_l;shift>=0;shift--){quotientDigit=base-1;if(remainder[shift+b_l]!==divisorMostSignificantDigit){quotientDigit=Math.floor((remainder[shift+b_l]*base+remainder[shift+b_l-1])/divisorMostSignificantDigit)}carry=0;borrow=0;l=divisor.length;for(i=0;i<l;i++){carry+=quotientDigit*divisor[i];q=Math.floor(carry/base);borrow+=remainder[shift+i]-(carry-q*base);carry=q;if(borrow<0){remainder[shift+i]=borrow+base;borrow=-1}else{remainder[shift+i]=borrow;borrow=0}}while(borrow!==0){quotientDigit-=1;carry=0;for(i=0;i<l;i++){carry+=remainder[shift+i]-base+divisor[i];if(carry<0){remainder[shift+i]=carry+base;carry=0}else{remainder[shift+i]=carry;carry=1}}borrow+=carry}result[shift]=quotientDigit}remainder=divModSmall(remainder,lambda)[0];return[arrayToSmall(result),arrayToSmall(remainder)]}function divMod2(a,b){var a_l=a.length,b_l=b.length,result=[],part=[],base=BASE,guess,xlen,highx,highy,check;while(a_l){part.unshift(a[--a_l]);trim(part);if(compareAbs(part,b)<0){result.push(0);continue}xlen=part.length;highx=part[xlen-1]*base+part[xlen-2];highy=b[b_l-1]*base+b[b_l-2];if(xlen>b_l){highx=(highx+1)*base}guess=Math.ceil(highx/highy);do{check=multiplySmall(b,guess);if(compareAbs(check,part)<=0)break;guess--}while(guess);result.push(guess);part=subtract(part,check)}result.reverse();return[arrayToSmall(result),arrayToSmall(part)]}function divModSmall(value,lambda){var length=value.length,quotient=createArray(length),base=BASE,i,q,remainder,divisor;remainder=0;for(i=length-1;i>=0;--i){divisor=remainder*base+value[i];q=truncate(divisor/lambda);remainder=divisor-q*lambda;quotient[i]=q|0}return[quotient,remainder|0]}function divModAny(self,v){var value,n=parseValue(v);var a=self.value,b=n.value;var quotient;if(b===0)throw new Error("Cannot divide by zero");if(self.isSmall){if(n.isSmall){return[new SmallInteger(truncate(a/b)),new SmallInteger(a%b)]}return[Integer[0],self]}if(n.isSmall){if(b===1)return[self,Integer[0]];if(b==-1)return[self.negate(),Integer[0]];var abs=Math.abs(b);if(abs<BASE){value=divModSmall(a,abs);quotient=arrayToSmall(value[0]);var remainder=value[1];if(self.sign)remainder=-remainder;if(typeof quotient==="number"){if(self.sign!==n.sign)quotient=-quotient;return[new SmallInteger(quotient),new SmallInteger(remainder)]}return[new BigInteger(quotient,self.sign!==n.sign),new SmallInteger(remainder)]}b=smallToArray(abs)}var comparison=compareAbs(a,b);if(comparison===-1)return[Integer[0],self];if(comparison===0)return[Integer[self.sign===n.sign?1:-1],Integer[0]];if(a.length+b.length<=200)value=divMod1(a,b);else value=divMod2(a,b);quotient=value[0];var qSign=self.sign!==n.sign,mod=value[1],mSign=self.sign;if(typeof quotient==="number"){if(qSign)quotient=-quotient;quotient=new SmallInteger(quotient)}else quotient=new BigInteger(quotient,qSign);if(typeof mod==="number"){if(mSign)mod=-mod;mod=new SmallInteger(mod)}else mod=new BigInteger(mod,mSign);return[quotient,mod]}BigInteger.prototype.divmod=function(v){var result=divModAny(this,v);return{quotient:result[0],remainder:result[1]}};SmallInteger.prototype.divmod=BigInteger.prototype.divmod;BigInteger.prototype.divide=function(v){return divModAny(this,v)[0]};SmallInteger.prototype.over=SmallInteger.prototype.divide=BigInteger.prototype.over=BigInteger.prototype.divide;BigInteger.prototype.mod=function(v){return divModAny(this,v)[1]};SmallInteger.prototype.remainder=SmallInteger.prototype.mod=BigInteger.prototype.remainder=BigInteger.prototype.mod;BigInteger.prototype.pow=function(v){var n=parseValue(v),a=this.value,b=n.value,value,x,y;if(b===0)return Integer[1];if(a===0)return Integer[0];if(a===1)return Integer[1];if(a===-1)return n.isEven()?Integer[1]:Integer[-1];if(n.sign){return Integer[0]}if(!n.isSmall)throw new Error("The exponent "+n.toString()+" is too large.");if(this.isSmall){if(isPrecise(value=Math.pow(a,b)))return new SmallInteger(truncate(value))}x=this;y=Integer[1];while(true){if(b&1===1){y=y.times(x);--b}if(b===0)break;b/=2;x=x.square()}return y};SmallInteger.prototype.pow=BigInteger.prototype.pow;BigInteger.prototype.modPow=function(exp,mod){exp=parseValue(exp);mod=parseValue(mod);if(mod.isZero())throw new Error("Cannot take modPow with modulus 0");var r=Integer[1],base=this.mod(mod);while(exp.isPositive()){if(base.isZero())return Integer[0];if(exp.isOdd())r=r.multiply(base).mod(mod);exp=exp.divide(2);base=base.square().mod(mod)}return r};SmallInteger.prototype.modPow=BigInteger.prototype.modPow;function compareAbs(a,b){if(a.length!==b.length){return a.length>b.length?1:-1}for(var i=a.length-1;i>=0;i--){if(a[i]!==b[i])return a[i]>b[i]?1:-1}return 0}BigInteger.prototype.compareAbs=function(v){var n=parseValue(v),a=this.value,b=n.value;if(n.isSmall)return 1;return compareAbs(a,b)};SmallInteger.prototype.compareAbs=function(v){var n=parseValue(v),a=Math.abs(this.value),b=n.value;if(n.isSmall){b=Math.abs(b);return a===b?0:a>b?1:-1}return-1};BigInteger.prototype.compare=function(v){if(v===Infinity){return-1}if(v===-Infinity){return 1}var n=parseValue(v),a=this.value,b=n.value;if(this.sign!==n.sign){return n.sign?1:-1}if(n.isSmall){return this.sign?-1:1}return compareAbs(a,b)*(this.sign?-1:1)};BigInteger.prototype.compareTo=BigInteger.prototype.compare;SmallInteger.prototype.compare=function(v){if(v===Infinity){return-1}if(v===-Infinity){return 1}var n=parseValue(v),a=this.value,b=n.value;if(n.isSmall){return a==b?0:a>b?1:-1}if(a<0!==n.sign){return a<0?-1:1}return a<0?1:-1};SmallInteger.prototype.compareTo=SmallInteger.prototype.compare;BigInteger.prototype.equals=function(v){return this.compare(v)===0};SmallInteger.prototype.eq=SmallInteger.prototype.equals=BigInteger.prototype.eq=BigInteger.prototype.equals;BigInteger.prototype.notEquals=function(v){return this.compare(v)!==0};SmallInteger.prototype.neq=SmallInteger.prototype.notEquals=BigInteger.prototype.neq=BigInteger.prototype.notEquals;BigInteger.prototype.greater=function(v){return this.compare(v)>0};SmallInteger.prototype.gt=SmallInteger.prototype.greater=BigInteger.prototype.gt=BigInteger.prototype.greater;BigInteger.prototype.lesser=function(v){return this.compare(v)<0};SmallInteger.prototype.lt=SmallInteger.prototype.lesser=BigInteger.prototype.lt=BigInteger.prototype.lesser;BigInteger.prototype.greaterOrEquals=function(v){return this.compare(v)>=0};SmallInteger.prototype.geq=SmallInteger.prototype.greaterOrEquals=BigInteger.prototype.geq=BigInteger.prototype.greaterOrEquals;BigInteger.prototype.lesserOrEquals=function(v){return this.compare(v)<=0};SmallInteger.prototype.leq=SmallInteger.prototype.lesserOrEquals=BigInteger.prototype.leq=BigInteger.prototype.lesserOrEquals;BigInteger.prototype.isEven=function(){return(this.value[0]&1)===0};SmallInteger.prototype.isEven=function(){return(this.value&1)===0};BigInteger.prototype.isOdd=function(){return(this.value[0]&1)===1};SmallInteger.prototype.isOdd=function(){return(this.value&1)===1};BigInteger.prototype.isPositive=function(){return!this.sign};SmallInteger.prototype.isPositive=function(){return this.value>0};BigInteger.prototype.isNegative=function(){return this.sign};SmallInteger.prototype.isNegative=function(){return this.value<0};BigInteger.prototype.isUnit=function(){return false};SmallInteger.prototype.isUnit=function(){return Math.abs(this.value)===1};BigInteger.prototype.isZero=function(){return false};SmallInteger.prototype.isZero=function(){return this.value===0};BigInteger.prototype.isDivisibleBy=function(v){var n=parseValue(v);var value=n.value;if(value===0)return false;if(value===1)return true;if(value===2)return this.isEven();return this.mod(n).equals(Integer[0])};SmallInteger.prototype.isDivisibleBy=BigInteger.prototype.isDivisibleBy;function isBasicPrime(v){var n=v.abs();if(n.isUnit())return false;if(n.equals(2)||n.equals(3)||n.equals(5))return true;if(n.isEven()||n.isDivisibleBy(3)||n.isDivisibleBy(5))return false;if(n.lesser(25))return true}BigInteger.prototype.isPrime=function(){var isPrime=isBasicPrime(this);if(isPrime!==undefined)return isPrime;var n=this.abs(),nPrev=n.prev();var a=[2,3,5,7,11,13,17,19],b=nPrev,d,t,i,x;while(b.isEven())b=b.divide(2);for(i=0;i<a.length;i++){x=bigInt(a[i]).modPow(b,n);if(x.equals(Integer[1])||x.equals(nPrev))continue;for(t=true,d=b;t&&d.lesser(nPrev);d=d.multiply(2)){x=x.square().mod(n);if(x.equals(nPrev))t=false}if(t)return false}return true};SmallInteger.prototype.isPrime=BigInteger.prototype.isPrime;BigInteger.prototype.isProbablePrime=function(iterations){var isPrime=isBasicPrime(this);if(isPrime!==undefined)return isPrime;var n=this.abs();var t=iterations===undefined?5:iterations;for(var i=0;i<t;i++){var a=bigInt.randBetween(2,n.minus(2));if(!a.modPow(n.prev(),n).isUnit())return false}return true};SmallInteger.prototype.isProbablePrime=BigInteger.prototype.isProbablePrime;BigInteger.prototype.modInv=function(n){var t=bigInt.zero,newT=bigInt.one,r=parseValue(n),newR=this.abs(),q,lastT,lastR;while(!newR.equals(bigInt.zero)){q=r.divide(newR);lastT=t;lastR=r;t=newT;r=newR;newT=lastT.subtract(q.multiply(newT));newR=lastR.subtract(q.multiply(newR))}if(!r.equals(1))throw new Error(this.toString()+" and "+n.toString()+" are not co-prime");if(t.compare(0)===-1){t=t.add(n)}if(this.isNegative()){return t.negate()}return t};SmallInteger.prototype.modInv=BigInteger.prototype.modInv;BigInteger.prototype.next=function(){var value=this.value;if(this.sign){return subtractSmall(value,1,this.sign)}return new BigInteger(addSmall(value,1),this.sign)};SmallInteger.prototype.next=function(){var value=this.value;if(value+1<MAX_INT)return new SmallInteger(value+1);return new BigInteger(MAX_INT_ARR,false)};BigInteger.prototype.prev=function(){var value=this.value;if(this.sign){return new BigInteger(addSmall(value,1),true)}return subtractSmall(value,1,this.sign)};SmallInteger.prototype.prev=function(){var value=this.value;if(value-1>-MAX_INT)return new SmallInteger(value-1);return new BigInteger(MAX_INT_ARR,true)};var powersOfTwo=[1];while(2*powersOfTwo[powersOfTwo.length-1]<=BASE)powersOfTwo.push(2*powersOfTwo[powersOfTwo.length-1]);var powers2Length=powersOfTwo.length,highestPower2=powersOfTwo[powers2Length-1];function shift_isSmall(n){return(typeof n==="number"||typeof n==="string")&&+Math.abs(n)<=BASE||n instanceof BigInteger&&n.value.length<=1}BigInteger.prototype.shiftLeft=function(n){if(!shift_isSmall(n)){throw new Error(String(n)+" is too large for shifting.")}n=+n;if(n<0)return this.shiftRight(-n);var result=this;while(n>=powers2Length){result=result.multiply(highestPower2);n-=powers2Length-1}return result.multiply(powersOfTwo[n])};SmallInteger.prototype.shiftLeft=BigInteger.prototype.shiftLeft;BigInteger.prototype.shiftRight=function(n){var remQuo;if(!shift_isSmall(n)){throw new Error(String(n)+" is too large for shifting.")}n=+n;if(n<0)return this.shiftLeft(-n);var result=this;while(n>=powers2Length){if(result.isZero())return result;remQuo=divModAny(result,highestPower2);result=remQuo[1].isNegative()?remQuo[0].prev():remQuo[0];n-=powers2Length-1}remQuo=divModAny(result,powersOfTwo[n]);return remQuo[1].isNegative()?remQuo[0].prev():remQuo[0]};SmallInteger.prototype.shiftRight=BigInteger.prototype.shiftRight;function bitwise(x,y,fn){y=parseValue(y);var xSign=x.isNegative(),ySign=y.isNegative();var xRem=xSign?x.not():x,yRem=ySign?y.not():y;var xDigit=0,yDigit=0;var xDivMod=null,yDivMod=null;var result=[];while(!xRem.isZero()||!yRem.isZero()){xDivMod=divModAny(xRem,highestPower2);xDigit=xDivMod[1].toJSNumber();if(xSign){xDigit=highestPower2-1-xDigit}yDivMod=divModAny(yRem,highestPower2);yDigit=yDivMod[1].toJSNumber();if(ySign){yDigit=highestPower2-1-yDigit}xRem=xDivMod[0];yRem=yDivMod[0];result.push(fn(xDigit,yDigit))}var sum=fn(xSign?1:0,ySign?1:0)!==0?bigInt(-1):bigInt(0);for(var i=result.length-1;i>=0;i-=1){sum=sum.multiply(highestPower2).add(bigInt(result[i]))}return sum}BigInteger.prototype.not=function(){return this.negate().prev()};SmallInteger.prototype.not=BigInteger.prototype.not;BigInteger.prototype.and=function(n){return bitwise(this,n,function(a,b){return a&b})};SmallInteger.prototype.and=BigInteger.prototype.and;BigInteger.prototype.or=function(n){return bitwise(this,n,function(a,b){return a|b})};SmallInteger.prototype.or=BigInteger.prototype.or;BigInteger.prototype.xor=function(n){return bitwise(this,n,function(a,b){return a^b})};SmallInteger.prototype.xor=BigInteger.prototype.xor;var LOBMASK_I=1<<30,LOBMASK_BI=(BASE&-BASE)*(BASE&-BASE)|LOBMASK_I;function roughLOB(n){var v=n.value,x=typeof v==="number"?v|LOBMASK_I:v[0]+v[1]*BASE|LOBMASK_BI;return x&-x}function integerLogarithm(value,base){if(base.compareTo(value)<=0){var tmp=integerLogarithm(value,base.square(base));var p=tmp.p;var e=tmp.e;var t=p.multiply(base);return t.compareTo(value)<=0?{p:t,e:e*2+1}:{p:p,e:e*2}}return{p:bigInt(1),e:0}}BigInteger.prototype.bitLength=function(){var n=this;if(n.compareTo(bigInt(0))<0){n=n.negate().subtract(bigInt(1))}if(n.compareTo(bigInt(0))===0){return bigInt(0)}return bigInt(integerLogarithm(n,bigInt(2)).e).add(bigInt(1))};SmallInteger.prototype.bitLength=BigInteger.prototype.bitLength;function max(a,b){a=parseValue(a);b=parseValue(b);return a.greater(b)?a:b}function min(a,b){a=parseValue(a);b=parseValue(b);return a.lesser(b)?a:b}function gcd(a,b){a=parseValue(a).abs();b=parseValue(b).abs();if(a.equals(b))return a;if(a.isZero())return b;if(b.isZero())return a;var c=Integer[1],d,t;while(a.isEven()&&b.isEven()){d=Math.min(roughLOB(a),roughLOB(b));a=a.divide(d);b=b.divide(d);c=c.multiply(d)}while(a.isEven()){a=a.divide(roughLOB(a))}do{while(b.isEven()){b=b.divide(roughLOB(b))}if(a.greater(b)){t=b;b=a;a=t}b=b.subtract(a)}while(!b.isZero());return c.isUnit()?a:a.multiply(c)}function lcm(a,b){a=parseValue(a).abs();b=parseValue(b).abs();return a.divide(gcd(a,b)).multiply(b)}function randBetween(a,b){a=parseValue(a);b=parseValue(b);var low=min(a,b),high=max(a,b);var range=high.subtract(low).add(1);if(range.isSmall)return low.add(Math.floor(Math.random()*range));var length=range.value.length-1;var result=[],restricted=true;for(var i=length;i>=0;i--){var top=restricted?range.value[i]:BASE;var digit=truncate(Math.random()*top);result.unshift(digit);if(digit<top)restricted=false}result=arrayToSmall(result);return low.add(typeof result==="number"?new SmallInteger(result):new BigInteger(result,false))}var parseBase=function(text,base){var length=text.length;var i;var absBase=Math.abs(base);for(var i=0;i<length;i++){var c=text[i].toLowerCase();if(c==="-")continue;if(/[a-z0-9]/.test(c)){if(/[0-9]/.test(c)&&+c>=absBase){if(c==="1"&&absBase===1)continue;throw new Error(c+" is not a valid digit in base "+base+".")}else if(c.charCodeAt(0)-87>=absBase){throw new Error(c+" is not a valid digit in base "+base+".")}}}if(2<=base&&base<=36){if(length<=LOG_MAX_INT/Math.log(base)){var result=parseInt(text,base);if(isNaN(result)){throw new Error(c+" is not a valid digit in base "+base+".")}return new SmallInteger(parseInt(text,base))}}base=parseValue(base);var digits=[];var isNegative=text[0]==="-";for(i=isNegative?1:0;i<text.length;i++){var c=text[i].toLowerCase(),charCode=c.charCodeAt(0);if(48<=charCode&&charCode<=57)digits.push(parseValue(c));else if(97<=charCode&&charCode<=122)digits.push(parseValue(c.charCodeAt(0)-87));else if(c==="<"){var start=i;do{i++}while(text[i]!==">");digits.push(parseValue(text.slice(start+1,i)))}else throw new Error(c+" is not a valid character")}return parseBaseFromArray(digits,base,isNegative)};function parseBaseFromArray(digits,base,isNegative){var val=Integer[0],pow=Integer[1],i;for(i=digits.length-1;i>=0;i--){val=val.add(digits[i].times(pow));pow=pow.times(base)}return isNegative?val.negate():val}function stringify(digit){if(digit<=35){return"0123456789abcdefghijklmnopqrstuvwxyz".charAt(digit)}return"<"+digit+">"}function toBase(n,base){base=bigInt(base);if(base.isZero()){if(n.isZero())return{value:[0],isNegative:false};throw new Error("Cannot convert nonzero numbers to base 0.")}if(base.equals(-1)){if(n.isZero())return{value:[0],isNegative:false};if(n.isNegative())return{value:[].concat.apply([],Array.apply(null,Array(-n)).map(Array.prototype.valueOf,[1,0])),isNegative:false};var arr=Array.apply(null,Array(+n-1)).map(Array.prototype.valueOf,[0,1]);arr.unshift([1]);return{value:[].concat.apply([],arr),isNegative:false}}var neg=false;if(n.isNegative()&&base.isPositive()){neg=true;n=n.abs()}if(base.equals(1)){if(n.isZero())return{value:[0],isNegative:false};return{value:Array.apply(null,Array(+n)).map(Number.prototype.valueOf,1),isNegative:neg}}var out=[];var left=n,divmod;while(left.isNegative()||left.compareAbs(base)>=0){divmod=left.divmod(base);left=divmod.quotient;var digit=divmod.remainder;if(digit.isNegative()){digit=base.minus(digit).abs();left=left.next()}out.push(digit.toJSNumber())}out.push(left.toJSNumber());return{value:out.reverse(),isNegative:neg}}function toBaseString(n,base){var arr=toBase(n,base);return(arr.isNegative?"-":"")+arr.value.map(stringify).join("")}BigInteger.prototype.toArray=function(radix){return toBase(this,radix)};SmallInteger.prototype.toArray=function(radix){return toBase(this,radix)};BigInteger.prototype.toString=function(radix){if(radix===undefined)radix=10;if(radix!==10)return toBaseString(this,radix);var v=this.value,l=v.length,str=String(v[--l]),zeros="0000000",digit;while(--l>=0){digit=String(v[l]);str+=zeros.slice(digit.length)+digit}var sign=this.sign?"-":"";return sign+str};SmallInteger.prototype.toString=function(radix){if(radix===undefined)radix=10;if(radix!=10)return toBaseString(this,radix);return String(this.value)};BigInteger.prototype.toJSON=SmallInteger.prototype.toJSON=function(){return this.toString()};BigInteger.prototype.valueOf=function(){return parseInt(this.toString(),10)};BigInteger.prototype.toJSNumber=BigInteger.prototype.valueOf;SmallInteger.prototype.valueOf=function(){return this.value};SmallInteger.prototype.toJSNumber=SmallInteger.prototype.valueOf;function parseStringValue(v){if(isPrecise(+v)){var x=+v;if(x===truncate(x))return new SmallInteger(x);throw"Invalid integer: "+v}var sign=v[0]==="-";if(sign)v=v.slice(1);var split=v.split(/e/i);if(split.length>2)throw new Error("Invalid integer: "+split.join("e"));if(split.length===2){var exp=split[1];if(exp[0]==="+")exp=exp.slice(1);exp=+exp;if(exp!==truncate(exp)||!isPrecise(exp))throw new Error("Invalid integer: "+exp+" is not a valid exponent.");var text=split[0];var decimalPlace=text.indexOf(".");if(decimalPlace>=0){exp-=text.length-decimalPlace-1;text=text.slice(0,decimalPlace)+text.slice(decimalPlace+1)}if(exp<0)throw new Error("Cannot include negative exponent part for integers");text+=new Array(exp+1).join("0");v=text}var isValid=/^([0-9][0-9]*)$/.test(v);if(!isValid)throw new Error("Invalid integer: "+v);var r=[],max=v.length,l=LOG_BASE,min=max-l;while(max>0){r.push(+v.slice(min,max));min-=l;if(min<0)min=0;max-=l}trim(r);return new BigInteger(r,sign)}function parseNumberValue(v){if(isPrecise(v)){if(v!==truncate(v))throw new Error(v+" is not an integer.");return new SmallInteger(v)}return parseStringValue(v.toString())}function parseValue(v){if(typeof v==="number"){return parseNumberValue(v)}if(typeof v==="string"){return parseStringValue(v)}return v}for(var i=0;i<1e3;i++){Integer[i]=new SmallInteger(i);if(i>0)Integer[-i]=new SmallInteger(-i)}Integer.one=Integer[1];Integer.zero=Integer[0];Integer.minusOne=Integer[-1];Integer.max=max;Integer.min=min;Integer.gcd=gcd;Integer.lcm=lcm;Integer.isInstance=function(x){return x instanceof BigInteger||x instanceof SmallInteger};Integer.randBetween=randBetween;Integer.fromArray=function(digits,base,isNegative){return parseBaseFromArray(digits.map(parseValue),parseValue(base||10),isNegative)};return Integer}();if(typeof module!=="undefined"&&module.hasOwnProperty("exports")){module.exports=bigInt}if(typeof define==="function"&&define.amd){define("big-integer",[],function(){return bigInt})}
var useCrypto = false; //use browser's crypto interface?
var useNative = false; //use native BigInt (https://caniuse.com/#search=BigInt -or- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#Browser_compatibility)
try {
   //sometimes crypto is defined but getRandomValues isn't
   if (typeof(crypto.getRandomValues) == "function") {
      useCrypto = true;
   }
} catch (err) {
}
try {
   //sometimes crypto is defined but getRandomValues isn't
   if (typeof(BigInt) == "function") {
      useNative = true;
   }
} catch (err) {
}

/**
* Handles all externally received messages from the host.
*
* External-to-internal function map:<br/>
* <br/>
* "randomPrime" => {@link generateRandomPrime}<br/>
* "checkPrime" => {@link checkPrime}<br/>
* "randomKeypair" => {@link generateRandomKeypair}<br/>
* "randomQuadResidues" => {@link generateRandomQuadResidues}<br/>
* "checkResidues" => {@link checkResidues}<br/>
* "encrypt" => {@link encrypt}<br/>
* "decrypt" => {@link decrypt}
* @private
* @param {Object} event A standard Worker "message" event.
*/
function handleMessage (event) {
   var request = event.data;
   var result = {};
   switch (event.data.method) {
      case "randomPrime":
         var bitLength = event.data.params.bitLength;
         var radix = event.data.params.radix;
         if (isNaN(radix)) {
            radix = 16; //default to hex
         }
         result = generateRandomPrime(bitLength, radix);
         break;
      case "checkPrime":
         var primeVal = event.data.params.prime.trim();
         if (primeVal.startsWith("0x")) {
            primeVal = primeVal.substring(2);
            radix = 16;
         } else {
            radix = 10;
         }
         result = checkPrime(primeVal, radix);
         break;
      case "randomKeypair":
         primeVal = event.data.params.prime.trim();
         if (primeVal.startsWith("0x")) {
            primeVal = primeVal.substring(2);
            radix = 16;
         } else {
            radix = 10;
         }
         result = generateRandomKeypair(primeVal, radix);
         break;
      case "randomQuadResidues":
         primeVal = event.data.params.prime.trim();
         var numValues = event.data.params.numValues;
         if (primeVal.startsWith("0x")) {
            primeVal = primeVal.substring(2);
            radix = 16;
         } else {
            radix = 10;
         }
         result = generateRandomQuadResidues(primeVal, numValues, radix);
         break;
      case "checkResidues":
         var residues = event.data.params.residues;
         primeVal = event.data.params.prime.trim();
         if (primeVal.startsWith("0x")) {
            primeVal = primeVal.substring(2);
            var primeRadix = 16;
         } else {
            primeRadix = 10;
         }
         var residueObjects = new Array();
         for (var count=0; count < residues.length; count++) {
            var currentValue = residues[count].trim();
            if (currentValue.startsWith("0x")) {
               currentValue = currentValue.substring(2);
               radix = 16;
            } else {
               radix = 10;
            }
            residueObjects.push({"value":currentValue, "radix":radix});
         }
         result = checkResidues(residueObjects, primeVal, primeRadix);
         break;
      case "encrypt":
         var keypair = event.data.params.keypair;
         if (keypair.encKey.startsWith("0x")) {
            keypair.encKey = keypair.encKey.substring(2);
            keypair.prime = keypair.prime.substring(2);
            var keyRadix = 16;
         } else {
            keyRadix = 10;
         }
         var value = event.data.params.value;
         if (value.startsWith("0x")) {
            var encValue = value.substring(2);
            var valueRadix = 16;
         } else {
            encValue = value;
            valueRadix = 10;
         }
         result = encrypt (encValue, valueRadix, keypair, keyRadix);
         break;
      case "decrypt":
            keypair = event.data.params.keypair;
            if (keypair.decKey.startsWith("0x")) {
               keypair.decKey = keypair.decKey.substring(2);
               keypair.prime = keypair.prime.substring(2);
               var keyRadix = 16;
            } else {
               keyRadix = 10;
            }
            var value = event.data.params.value;
            if (value.startsWith("0x")) {
               var decValue = value.substring(2);
               var valueRadix = 16;
            } else {
               decValue = value;
               valueRadix = 10;
            }
            result = decrypt (decValue, valueRadix, keypair, keyRadix);
            break;
      default:
         break;
    }
    postMessage({"result": result, "requestID": request.requestID});
}

/**
* Generates a pseudo-random positive integer using the most secure method available
* (the second option can probably be improved).
*
* @param {Number} maxValue The returned random integer will be between 0 and
* this parameter.
* @return {Number|Integer} A pseudo-random positive integer value in the
* range 0 to maxValue.
* @private
*/
function randomInteger(maxValue) {
   if (useCrypto) {
      //use safer crypto interface if available
      var arr = new Uint32Array(2);
      crypto.getRandomValues(arr);
      var multiplier = 0;
      (arr[0] > arr[1]) ? multiplier = arr[1] / arr[0] :  multiplier = arr[0] / arr[1];
      return (Math.round(multiplier * maxValue));
   } else {
      //the second option
      return (Math.round(Math.random() * maxValue));
   }
}

/**
* Generates a pseudo-random bit string of a given length.
*
* @param {Number} bitLength The number of bits / length of the result.
* @return {String} A pseudo-random bit string of length bitLength.
* @private
*/
function randomBitStr(bitLength) {
   return (Array.from({length:bitLength}, (v, i) => {return ((i==0) ? 1 : randomInteger(1))}).join(""));
}

/**
* Generates a random n-bit prime number and returns it in a given radix.
*
* @param {Number} bitLength The number of bits to use for the generated prime
* value.
* @param {Number} radix=16|10 The radix of the returned value string. Must be
* either 16 or 10
* @return {String} A bitLength-length prime number value represented as a string,
* either a hexadecimal value (if radix is 16), or a decimal value (if radix is 10).
* @private
*/
function generateRandomPrime(bitLength, radix) {
   var bitStr = randomBitStr(bitLength);
   var bi_prime = bigInt(bitStr, 2);
   while (bi_prime.isPrime() == false) {
      bi_prime = bi_prime.minus(bigInt.one);
   }
   if (radix == 16) {
      return ("0x" + bi_prime.toString(radix));
   } else {
      return (bi_prime.toString(radix));
   }
}

/**
* Checks whether the input prime value string is actually a prime value.
*
* @param {String} primeVal The string representation of the prime value to check.
* @param {Number} radix The expected radix of primeVal, either 16 (hex) or
* 10 (dec).
* @return {Boolean} True if the primeVal string represents a prime number value.
* @private
*/
function checkPrime(primeVal, radix) {
   var bi_prime = bigInt(primeVal, radix);
   return (bi_prime.isPrime());
}

/**
* Generates a random keypair from a given prime number.
*
* @param {String} primeVal The prime number value representation to use to
* generate the keypair.
* @param {Number} radix The assumed radix of the primeVal value and for the
* generated keypair.
* @return {keypair} The generated keypair+prime value object in the specified
* radix.
* @private
*/
function generateRandomKeypair(primeVal, radix) {
   var bi_prime = bigInt(primeVal, radix);
   var bi_phi_prime = bi_prime.minus(1); //assume this is a prime number
   var encKey = bigInt(randomBitStr(bi_phi_prime.bitLength()), 2);
   var done = false;
   while (!done) {
      try {
         var decKey = encKey.modInv(bi_phi_prime);
         done = true;
      } catch (err) {
         encKey = encKey.minus(1);
         done = false;
      }
   }
   if (radix == 16) {
      return ({"encKey":"0x"+encKey.toString(radix), "decKey":"0x"+decKey.toString(radix), "prime":"0x"+bi_prime.toString(16)});
   } else {
      return ({"encKey":encKey.toString(radix), "decKey":decKey.toString(radix), "prime":bi_prime.toString(10)});
   }
}

/**
* Generates a fixed series of sequential quadratic residues modulo a given prime
* value. This is done by halving the prime minus 1 and using that as the
* starting value of the lowest possible quadratic residue.
* In other words, the starting point for the quadratic residue series is:
* <code>(primeVal-1)/2</code>
*
* @param {String} primeVal The representation of the prime number to use to
* generate the quadratic residues.
* @param {Number} numValues The number of sequential quadratic residues to
* generate.
* @param {Number} radix The assumed radix of primeVal and of the generated
* quadratic residues.
* @return {Array} The sequentially generated quadratic residues as
* string representations in the given radix.
* @private
*/
function generateRandomQuadResidues(primeVal, numValues, radix) {
   var residues = new Array();
   var bi_prime = bigInt(primeVal, radix);
   var bi_phi_prime = bi_prime.minus(1); //assume this is a prime number
   var bi_exp = bi_phi_prime.divide(2);
   var currentValue = bi_exp.minus(1); //start with one less than half the prime
   while (residues.length < numValues) {
      if (currentValue.modPow(bi_exp, bi_prime).equals(1)) {
         if (radix == 16) {
            residues.push("0x"+currentValue.toString(16));
         } else {
            residues.push(currentValue.toString(10));
         }
      }
      currentValue = currentValue.plus(1);
   }
   return (residues);
}

/**
* Calculates the quadratic residues / non-residues of a series of numbers
* modulo a given prime value.
*
* @param {Array} residueObjects Objects containing:
* @param {String} residueObjects.value The representation of the value to calculate
* quadratic residue / non-residue for.
* @param {Number} residueObjects.radix The assumed radix of the associated value.
* @param {Number} radix The assumed radix of primeVal.
* @return {Array} The calculated quadratic residues (1) or non-residues (primeVal-1)
* of the residueObjects array with the indexes of the input array matching the
* indexes of the results.
* @private
*/
function checkResidues(residueObjects, primeVal, primeRadix) {
   var residues = new Array();
   var bi_prime = bigInt(primeVal, primeRadix);
   var bi_phi_prime = bi_prime.minus(1); //assume this is a prime number
   var bi_exp = bi_phi_prime.divide(2);
   var currentValue = bi_exp.minus(1); //start with one less than half the prime
   var returnValues = new Array();
   for (var count=0; count < residueObjects.length; count++) {
      var currentResObject = residueObjects[count];
      var currentValue = bigInt(currentResObject.value, currentResObject.radix);
      returnValues.push(currentValue.modPow(bi_exp, bi_prime).toString(currentResObject.radix));
   }
   return (returnValues);
}

/**
* Encrypts a value with a keypair object.
*
* @param {String} encValue The representation of the value to encrypt.
* @param {Number} valueRadix The assumed radix of encValue.
* @param {keypair} keypair A keypair to use for the operation.
* @param {Number} keyRadix The assumed radix of all of the values in the keypair.
* @return {String} The encrypted value as a string representation in the valueRadix.
* @private
*/
function encrypt (encValue, valueRadix, keypair, keyRadix) {
   var value = bigInt(encValue, valueRadix);
   var key = bigInt(keypair.encKey, keyRadix);
   var prime = bigInt(keypair.prime, keyRadix);
   var result = value.modPow(key, prime);
   if (valueRadix == 16) {
      return ("0x"+result.toString(valueRadix));
   } else {
      return (result.toString(valueRadix));
   }
}


/**
* Decrypts a value with a keypair object.
*
* @param {String} decValue The representation of the value to decrypt.
* @param {Number} valueRadix The assumed radix of decValue.
* @param {keypair} keypair A keypair to use for the operation.
* @param {Number} keyRadix The assumed radix of all of the values in the keypair.
* @return {String} The decrypted value as a string representation in the valueRadix.
* @private
*/
function decrypt (decValue, valueRadix, keypair, keyRadix) {
   var value = bigInt(decValue, valueRadix);
   var key = bigInt(keypair.decKey, keyRadix);
   var prime = bigInt(keypair.prime, keyRadix);
   var result = value.modPow(key, prime);
   if (valueRadix == 16) {
      return ("0x"+result.toString(valueRadix));
   } else {
      return (result.toString(valueRadix));
   }
}

// Native BigInt functons (not yet implemented above)

/*

function isPrimeNative(n) {
   n = BigInt(n)
   if (n % 1n || n < 2n) return false;
   if (n==leastFactor(n)) return true;
   return false;
}



function leastFactor (n){
   n = BigInt(n)
 if (n==0n) return 0n;
 if (n % 1n || n*n < 2n) return 1n;
 if (n%2n==0n) return 2n;
 if (n%3n==0n) return 3n;
 if (n%5n==0n) return 5n;
 var m = sqrt(n);
 for (var i=7n;i<=m;i+=30n) {
  if (n%i==0n)      return i;
  if (n%(i+4n)==0n)  return i+4n;
  if (n%(i+6n)==0n)  return i+6n;
  if (n%(i+10n)==0n) return i+10n;
  if (n%(i+12n)==0n) return i+12n;
  if (n%(i+16n)==0n) return i+16n;
  if (n%(i+22n)==0n) return i+22n;
  if (n%(i+24n)==0n) return i+24n;
 }
 return n;
}

function sqrt(value) {
		if (value < 0n) {
			throw 'square root of negative numbers is not supported'
		}

		if (value < 2n) {
			return value;
		}

		function newtonIteration(n, x0) {
			const x1 = ((n / x0) + x0) >> 1n;
			if (x0 === x1 || x0 === (x1 - 1n)) {
				return x0;
			}
			return newtonIteration(n, x1);
		}

		return newtonIteration(value, 1n);
	}

function modInvNative(x, m) {
   var inverse = xgcdNative(BigInt(x), BigInt(m))[0];
   if (inverse < BigInt(0)) {
      inverse = m + inverse;
   }
   return (inverse);
}

function xgcdNative(a, m) {
  if (m == BigInt(0)) {
    return ([BigInt(1), BigInt(0), a]);
  }
  temp = xgcdNative(m, a % m);
  var x = temp[BigInt(0)];
  var y = temp[BigInt(1)];
  var d = temp[BigInt(2)];
   return ([y, x-y*(a/m), d]);
}

function generateRandomPrimeNative(startValue, radix) {
   var prime = BigInt(startValue);
   while (isPrimeNative(prime)== false) {
      prime = prime - 1n;
   }
   if (radix == 16) {
      return ("0x" + prime.toString(radix));
   } else {
      return (prime.toString(radix));
   }
}

function generateRandomPrimeNative(bitLength, radix) {
   var bitStr = randomBitStr(bitLength);
   var prime = BigInt("0b"+bitStr);
   while (isPrimeNative(prime)== false) {
      prime = prime - 1n;
   }
   if (radix == 16) {
      return ("0x" + prime.toString(radix));
   } else {
      return (prime.toString(radix));
   }
}
*/
//setup message handler
onmessage = handleMessage;

//signal host that worker is ready to accept requests
postMessage({"ready":true});
