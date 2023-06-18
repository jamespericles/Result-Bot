"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queryString = __importStar(require("../../graphql/queries/getEventID"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// @ts-ignore
const fetch = (...args) => 
// @ts-ignore
import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { STARTGG_KEY, STARTGG_URI } = process.env;
const getEventID = (eventSlug) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let eventID = 0;
    if (STARTGG_KEY && STARTGG_URI) {
        const query = (_c = (_b = (_a = queryString.default) === null || _a === void 0 ? void 0 : _a.loc) === null || _b === void 0 ? void 0 : _b.source) === null || _c === void 0 ? void 0 : _c.body;
        if (query) {
            const response = yield fetch(STARTGG_URI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    Authorization: `Bearer ${STARTGG_KEY}`,
                },
                body: JSON.stringify({
                    query,
                    variables: {
                        slug: eventSlug,
                    },
                }),
            });
            // TODO: Is this the best way to handle this?
            const { data } = (yield response.json());
            if (!data || !data.event) {
                throw new Error(`Event with slug ${eventSlug} not found`);
            }
            eventID = data.event.id;
        }
    }
    return eventID;
});
exports.default = getEventID;
